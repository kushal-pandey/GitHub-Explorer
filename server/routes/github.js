const express = require('express')
const fetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args))
const cache = require('../cache')

const router = express.Router()
const GITHUB_API = 'https://api.github.com'

const getHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return headers
}

router.get('/:username', async (req, res, next) => {
  const { username } = req.params
  const page = req.query.page || 1
  const cacheKey = `${username}_page${page}`

  const cached = cache.get(cacheKey)
  if (cached) return res.json({ ...cached, cached: true })

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${GITHUB_API}/users/${username}`, { headers: getHeaders() }),
      fetch(
        `${GITHUB_API}/users/${username}/repos?per_page=30&page=${page}&sort=updated`,
        { headers: getHeaders() }
      ),
    ])

    if (userRes.status === 404) {
      return res.status(404).json({ error: 'User not found' })
    }
    if (userRes.status === 401) {
      return res.status(401).json({ error: 'Invalid GitHub token. Check your .env file.' })
    }
    if (userRes.status === 403 || userRes.status === 429) {
      return res.status(429).json({ error: 'GitHub rate limit exceeded. Try again later.' })
    }
    if (!userRes.ok) {
      return res.status(userRes.status).json({ error: 'GitHub API error' })
    }

    const user = await userRes.json()
    const repos = await reposRes.json()

    const payload = {
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
        html_url: user.html_url,
      },
      repos: repos.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        language: r.language,
        stargazers_count: r.stargazers_count,
        updated_at: r.updated_at,
        open_issues_count: r.open_issues_count,
        default_branch: r.default_branch,
        html_url: r.html_url,
      })),
    }

    cache.set(cacheKey, payload)
    res.json({ ...payload, cached: false })
  } catch (err) {
    next(err)
  }
})

module.exports = router