;(() => {
  const BASE_URL = 'https://api.github.com/repos'

  const FILE_EXTENSIONS = {
    C: '.c',
    'C++': '.cpp',
    'C#': '.cs',
    Dart: '.dart',
    Elixir: '.ex',
    Erlang: '.erl',
    Go: '.go',
    Java: '.java',
    JavaScript: '.js',
    Kotlin: '.kt',
    PHP: '.php',
    Python: '.py',
    Python3: '.py',
    Racket: '.rkt',
    Ruby: '.rb',
    Rust: '.rs',
    Scala: '.scala',
    Swift: '.swift',
    TypeScript: '.ts',
    MySQL: '.sql',
    PostgreSQL: '.sql',
    Oracle: '.sql',
    'MS SQL Server': '.tsql',
    Pandas: '.py',
  }

  const LOCAL_STORAGE_KEYS = {
    C: 'c',
    'C++': 'cpp',
    'C#': 'csharp',
    Dart: 'dart',
    Elixir: 'elixir',
    Erlang: 'erlang',
    Go: 'golang',
    Java: 'java',
    JavaScript: 'javascript',
    Kotlin: 'kotlin',
    PHP: 'php',
    Python: 'python',
    Python3: 'python3',
    Racket: 'racket',
    Ruby: 'ruby',
    Rust: 'rust',
    Scala: 'scala',
    Swift: 'swift',
    TypeScript: 'typeScript',
    MySQL: 'mysql',
    Oracle: 'oraclesql',
    PostgreSQL: 'postgresql',
    'MS SQL Server': 'mssql',
    Pandas: 'pythondata',
  }

  const DATABASE_LANGUAGES = ['MySQL', 'Oracle', 'PostgreSQL', 'MS SQL Server', 'Pandas']

  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)

  const DEFAULT_SHORTCUT = isMac ? { key: 'p', modifier: 'meta' } : { key: 'p', modifier: 'ctrl' }

  const getShortcutDisplayText = (shortcut) => {
    const sym =
      shortcut.modifier === 'meta'
        ? '⌘'
        : shortcut.modifier === 'alt'
          ? '⌥'
          : shortcut.modifier === 'shift'
            ? '⇧'
            : shortcut.modifier === 'ctrl'
              ? 'Ctrl+'
              : ''
    return `${sym}${shortcut.key.toUpperCase()}`
  }

  const getKeyboardShortcut = () => {
    const saved = localStorage.getItem('keyboard-shortcut')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return DEFAULT_SHORTCUT
      }
    }
    return DEFAULT_SHORTCUT
  }

  let KEYBOARD_SHORTCUT = getKeyboardShortcut()
  let SHORTCUT_DISPLAY = getShortcutDisplayText(KEYBOARD_SHORTCUT)

  // Fallback-only DOM selectors — only used when API/localStorage approach fails
  const FALLBACK_SELECTORS = {
    parentDiv:
      'div.flex.justify-between.py-1.pl-3.pr-1 > div.relative.flex.overflow-hidden.rounded.bg-fill-tertiary.dark\\:bg-fill-tertiary.\\!bg-transparent > div.flex-none.flex > div:nth-child(2)',
    parentDivCodeEditor:
      '#ide-top-btns > div:nth-child(1) > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div:last-child',
    performanceMetrics:
      'div.flex.items-center.justify-between.gap-2 > div > div.rounded-sd.flex.min-w-\\[275px\\].flex-1.cursor-pointer.flex-col.px-4.py-3.text-xs > div:nth-child(2) > span.font-semibold',
  }

  // ─── Toast System ─────────────────────────────────────────────────────────

  function injectToastStyles() {
    if (document.getElementById('lp-toast-styles')) return
    const style = document.createElement('style')
    style.id = 'lp-toast-styles'
    style.textContent = `
      #lp-toaster {
        position: fixed;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999999;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        pointer-events: none;
        width: 356px;
        max-width: calc(100vw - 2rem);
      }
      .lp-toast {
        pointer-events: all;
        display: flex;
        align-items: flex-start;
        gap: 0.625rem;
        padding: 0.875rem 1rem;
        border-radius: 0.625rem;
        font-size: 13px;
        font-weight: 500;
        line-height: 1.45;
        background: #18181b;
        border: 1px solid #3f3f46;
        color: #fafafa;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.4), 0 10px 20px -4px rgba(0,0,0,0.5);
        animation: lp-toast-in 0.35s cubic-bezier(0.21,1.02,0.73,1) forwards;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .lp-toast-icon {
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        margin-top: 1px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 10px;
        font-weight: 700;
      }
      .lp-toast-error .lp-toast-icon  { background: #ef4444; color: #fff; }
      .lp-toast-success .lp-toast-icon { background: #22c55e; color: #fff; }
      .lp-toast-info .lp-toast-icon    { background: #3b82f6; color: #fff; }
      .lp-toast-message { flex: 1; }
      .lp-toast-close {
        background: none;
        border: none;
        color: #71717a;
        cursor: pointer;
        font-size: 13px;
        padding: 0;
        flex-shrink: 0;
        line-height: 1;
        transition: color 0.15s;
        margin-top: 1px;
      }
      .lp-toast-close:hover { color: #fafafa; }
      .lp-toast-out {
        animation: lp-toast-out 0.25s ease forwards !important;
      }
      @keyframes lp-toast-in {
        from { opacity: 0; transform: translateY(-12px) scale(0.95); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
      }
      @keyframes lp-toast-out {
        from { opacity: 1; transform: translateY(0) scale(1); max-height: 80px; margin-bottom: 0; }
        to   { opacity: 0; transform: translateY(-8px) scale(0.95); max-height: 0; margin-bottom: -0.5rem; }
      }
    `
    document.head.appendChild(style)
  }

  function ensureToaster() {
    let toaster = document.getElementById('lp-toaster')
    if (!toaster) {
      toaster = document.createElement('div')
      toaster.id = 'lp-toaster'
      document.body.appendChild(toaster)
    }
    return toaster
  }

  function showToast(message, type = 'error') {
    injectToastStyles()
    const toaster = ensureToaster()

    const toast = document.createElement('div')
    toast.className = `lp-toast lp-toast-${type}`

    const iconText = type === 'error' ? '✕' : type === 'success' ? '✓' : 'i'
    toast.innerHTML = `
      <span class="lp-toast-icon">${iconText}</span>
      <span class="lp-toast-message">${message}</span>
      <button class="lp-toast-close" aria-label="Close">✕</button>
    `

    toast.querySelector('.lp-toast-close').addEventListener('click', () => dismissToast(toast))
    toaster.appendChild(toast)

    const timer = setTimeout(() => dismissToast(toast), 4500)
    toast._lpTimer = timer
  }

  function dismissToast(toast) {
    if (!toast.isConnected) return
    clearTimeout(toast._lpTimer)
    toast.classList.add('lp-toast-out')
    toast.addEventListener('animationend', () => toast.remove(), { once: true })
  }

  // ─── Problem Resolution: URL + GraphQL + localStorage ─────────────────────

  function getProblemSlugFromURL() {
    const match = window.location.pathname.match(/\/problems\/([^/]+)\//)
    return match?.[1] ?? null
  }

  async function getProblemMetaFromGraphQL(titleSlug) {
    try {
      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `{ question(titleSlug: "${titleSlug}") { questionFrontendId title } }`,
        }),
      })
      const data = await res.json()
      return data?.data?.question ?? null
    } catch {
      return null
    }
  }

  async function fetchFullProblemData(titleSlug) {
    try {
      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `{
            question(titleSlug: "${titleSlug}") {
              questionFrontendId
              title
              difficulty
              content
              topicTags { name }
            }
          }`,
        }),
      })
      const data = await res.json()
      return data?.data?.question ?? null
    } catch {
      return null
    }
  }

  function buildReadme(problemData, solutionFileName) {
    const { questionFrontendId, title, difficulty, content, topicTags } = problemData
    const slug = title.toLowerCase().replaceAll(' ', '-')
    const url = `https://leetcode.com/problems/${slug}/`
    const tags = topicTags?.map((t) => t.name).join(', ') || 'N/A'
    const diffEmoji = difficulty === 'Easy' ? '🟢' : difficulty === 'Medium' ? '🟡' : '🔴'

    return `# ${questionFrontendId}. ${title}

${diffEmoji} **${difficulty}** &nbsp;|&nbsp; [View on LeetCode](${url})

**Topics:** ${tags}

---

${content || ''}

---

**My Solution:** [${solutionFileName}](./${solutionFileName})
`
  }

  // Scan all buttons for a known language name — resilient to LeetCode DOM changes
  function detectLanguage() {
    const buttons = document.querySelectorAll('button')
    for (const btn of buttons) {
      const text = btn.textContent?.trim()
      if (text && FILE_EXTENSIONS[text]) return text
    }
    return null
  }

  function getSolutionFromLocalStorage(probNum) {
    const allKeys = []
    for (let i = 0; i < localStorage.length; i++) {
      allKeys.push(localStorage.key(i))
    }

    for (const [lang, langKey] of Object.entries(LOCAL_STORAGE_KEYS)) {
      const match = allKeys.find((k) => {
        const parts = k.split('_')
        return parts[0] === probNum && parts[parts.length - 1] === langKey
      })
      if (match) {
        const raw = localStorage.getItem(match)
        if (raw) {
          return {
            lang,
            solution: raw.replace(/\\n/g, '\n').replace(/ {2}/g, '  ').replace(/"/g, ''),
          }
        }
      }
    }
    return null
  }

  function findPercentValues() {
    const pctPattern = /^\d+\.?\d*%$/
    const results = []
    document.querySelectorAll('span').forEach((el) => {
      const text = el.textContent?.trim() ?? ''
      if (pctPattern.test(text)) results.push(text)
    })
    return results
  }

  function extractPerformanceMetrics(language) {
    // Try specific selector first
    const specific = document.querySelectorAll(FALLBACK_SELECTORS.performanceMetrics)

    if (DATABASE_LANGUAGES.includes(language)) {
      if (specific.length >= 2) {
        return { runtime: specific[1]?.textContent?.trim() || 'N/A', memory: null }
      }
      const pct = findPercentValues()
      return { runtime: pct[0] || 'N/A', memory: null }
    }

    if (specific.length >= 4) {
      return {
        runtime: specific[1]?.textContent?.trim() || 'N/A',
        memory: specific[3]?.textContent?.trim() || 'N/A',
      }
    }

    // Fallback: locate % values in the page
    const pct = findPercentValues()
    return { runtime: pct[0] || 'N/A', memory: pct[1] || 'N/A' }
  }

  async function extractProblemInfo() {
    try {
      const titleSlug = getProblemSlugFromURL()
      if (!titleSlug) {
        console.error('LeetPush: could not extract problem slug from URL')
        return null
      }

      const meta = await getProblemMetaFromGraphQL(titleSlug)
      if (!meta) {
        console.error('LeetPush: GraphQL returned no data for slug:', titleSlug)
        return null
      }

      const probNum = meta.questionFrontendId
      const probName = meta.title.replaceAll(' ', '-')

      const language = detectLanguage()
      if (!language || !FILE_EXTENSIONS[language]) {
        console.error('LeetPush: could not detect solution language')
        return null
      }

      const fullFileName = `${probNum}-${probName}${FILE_EXTENSIONS[language]}`

      // Prefer localStorage; fall back to DOM code block
      let solution = null
      const stored = getSolutionFromLocalStorage(probNum)
      if (stored) {
        solution = stored.solution
      } else {
        const codeEl = document.querySelector('div.px-4.py-3 > div > pre > code')
        if (codeEl) {
          solution = Array.from(codeEl.children).map((line) =>
            Array.from(line.childNodes).slice(1).map((n) => n.textContent).join('')
          ).join('').replace(/ /g, ' ') || codeEl.textContent || ''
        }
      }

      if (!solution) {
        console.error('LeetPush: solution not found in localStorage or DOM')
        return null
      }

      const metrics = extractPerformanceMetrics(language)
      const commitMsg =
        metrics.memory !== null
          ? `[${probNum}] [Time Beats: ${metrics.runtime}] [Memory Beats: ${metrics.memory}] - LeetPush`
          : `[${probNum}] [Time Beats: ${metrics.runtime}] - LeetPush`

      sessionStorage.setItem('fileName', fullFileName)
      sessionStorage.setItem('solution', solution)
      sessionStorage.setItem('commitMsg', commitMsg)

      return { probNum, probName, fileName: fullFileName, solution, commitMsg, language }
    } catch (error) {
      console.error('LeetPush: error extracting problem info:', error)
      return null
    }
  }

  // ─── Submission Detection ─────────────────────────────────────────────────

  function isSubmissionPage() {
    return window.location.pathname.includes('/submissions/')
  }

  function hasAcceptedSolution() {
    // Text-based scan — resilient to class name changes
    const candidates = document.querySelectorAll('span, div, h4, p')
    return Array.from(candidates).some(
      (el) => el.childElementCount === 0 && el.textContent?.trim() === 'Accepted',
    )
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // ─── Keyboard Shortcut ────────────────────────────────────────────────────

  function registerKeyboardShortcut() {
    document.addEventListener('keydown', (event) => {
      const modMatch =
        (KEYBOARD_SHORTCUT.modifier === 'meta' && event.metaKey) ||
        (KEYBOARD_SHORTCUT.modifier === 'alt' && event.altKey) ||
        (KEYBOARD_SHORTCUT.modifier === 'shift' && event.shiftKey) ||
        (KEYBOARD_SHORTCUT.modifier === 'ctrl' && event.ctrlKey)

      if (modMatch && event.key.toLowerCase() === KEYBOARD_SHORTCUT.key.toLowerCase()) {
        event.preventDefault()
        handlePushClick()
      }
    })
  }

  // ─── Button Injection ─────────────────────────────────────────────────────

  function findParent(selectors) {
    for (const sel of selectors) {
      const el = document.querySelector(sel)
      if (el) return el
    }
    return null
  }

  function injectButtons() {
    const parentDiv = findParent([FALLBACK_SELECTORS.parentDiv])
    const parentDivCodeEditor = findParent([FALLBACK_SELECTORS.parentDivCodeEditor])

    if (parentDiv) {
      injectButtonsToParent(
        parentDiv,
        'leetpush-div-edit',
        'leetpush-btn-edit',
        'Edit',
        'leetpush-div',
        'leetpush-btn',
        `Push (${SHORTCUT_DISPLAY})`,
        false,
      )
    }

    if (parentDivCodeEditor) {
      injectButtonsToParent(
        parentDivCodeEditor,
        'leetpush-div-edit-CodeEditor',
        'leetpush-btn-edit-CodeEditor',
        'Edit',
        'leetpush-div-CodeEditor',
        'leetpush-btn-CodeEditor',
        `Push (${SHORTCUT_DISPLAY})`,
        true,
      )
    }
  }

  function injectButtonsToParent(
    parent,
    editContainerId,
    editButtonId,
    editText,
    pushContainerId,
    pushButtonId,
    pushText,
    isCodeEditor,
  ) {
    if (document.getElementById(editContainerId) || document.getElementById(pushContainerId)) return

    const editButton = createButton(editContainerId, editButtonId, editText, () => {
      localStorage.removeItem('branch')
      handlePushClick()
    })

    const pushButton = createButton(pushContainerId, pushButtonId, pushText, handlePushClick)

    if (isCodeEditor) {
      const divider1 = document.createElement('div')
      divider1.style.cssText = 'background-color:#0f0f0f;width:1px;height:100%;flex-shrink:0'
      const divider2 = document.createElement('div')
      divider2.style.cssText = 'background-color:#0f0f0f;width:1px;height:100%;flex-shrink:0'
      parent.appendChild(divider1)
      parent.appendChild(editButton)
      parent.appendChild(divider2)
      parent.appendChild(pushButton)
    } else {
      parent.appendChild(editButton)
      parent.appendChild(pushButton)
    }
  }

  function createButton(containerId, buttonId, text, clickHandler) {
    const container = document.createElement('div')
    container.id = containerId

    const button = document.createElement('button')
    button.id = buttonId
    button.textContent = text

    container.addEventListener('click', () => {
      if (!button.disabled) clickHandler()
    })

    container.appendChild(button)
    return container
  }

  function updateButtonLabels() {
    const btns = [
      document.querySelector('#leetpush-btn'),
      document.querySelector('#leetpush-btn-CodeEditor'),
    ]
    btns.forEach((btn) => {
      if (btn) btn.textContent = `Push (${SHORTCUT_DISPLAY})`
    })
  }

  // ─── Config Modal ─────────────────────────────────────────────────────────

  function createConfigModal() {
    const modal = document.createElement('div')
    modal.id = 'lp-modal'
    modal.innerHTML = `
    <div id="lp-container">
      <div id="lp-close-btn"><button aria-label="Close">✕</button></div>
      <h3>Leet<span>Push</span></h3>
      <form id="lp-form">
        <div class="lp-div">
          <label>Repository URL:</label>
          <input type="text" id="repo-url" name="repo-url" placeholder="https://github.com/username/repository" required>
        </div>
        <div class="lp-div">
          <label>Token: <a href="https://scribehow.com/shared/Generating_a_personal_access_token_on_GitHub__PUPxxuxIRQmlg1MUE-2zig" target="_blank">Generate Token?</a></label>
          <input type="text" id="token" name="token" placeholder="github_pat_..." required>
        </div>
        <div class="lp-div">
          <label>Target directory push:</label>
          <input type="text" id="custom-dir" name="custom-dir" placeholder="Leave empty to push to the root.">
        </div>
        <div class="lp-push-mode">
          <label>Push mode:</label>
          <div id="lp-push-mode-radios">
            <div class="radio-div">
              <input type="radio" id="push-mode-single" name="push-mode" value="single" checked>
              <label for="push-mode-single">Single file</label>
            </div>
            <div class="radio-div">
              <input type="radio" id="push-mode-folder" name="push-mode" value="folder">
              <label for="push-mode-folder">Folder per problem</label>
            </div>
          </div>
          <p class="lp-hint">Folder mode pushes <code>{id}-{slug}/solution + README.md</code> in one commit.</p>
        </div>
        <div class="lp-keyboard-shortcut">
          <label>Keyboard shortcut:</label>
          <div class="shortcut-config">
            <select id="shortcut-modifier">
              <option value="meta">${isMac ? '⌘ Command' : '⊞ Windows'}</option>
              <option value="ctrl">Ctrl</option>
              <option value="alt">${isMac ? '⌥ Option' : 'Alt'}</option>
              <option value="shift">⇧ Shift</option>
            </select>
            <span>+</span>
            <input type="text" id="shortcut-key" maxlength="1" placeholder="Key">
          </div>
        </div>
        <div class="lp-daily-challenge">
          <label>Daily problems on a separate folder:</label>
          <div id="lp-radios">
            <div class="radio-div">
              <input type="radio" id="separate-folder-yes" name="daily-challenge" value="yes">
              <label for="separate-folder-yes">yes</label>
            </div>
            <div class="radio-div">
              <input type="radio" id="separate-folder-no" name="daily-challenge" value="no" checked>
              <label for="separate-folder-no">no</label>
            </div>
          </div>
        </div>
        <div>
          <label>Repository branch:</label>
          <div id="lp-radios">
            <div class="radio-div">
              <input type="radio" id="branch-master" name="branch-name" value="master" checked>
              <label for="branch-master">master</label>
            </div>
            <div class="radio-div">
              <input type="radio" id="branch-main" name="branch-name" value="main">
              <label for="branch-main">main</label>
            </div>
          </div>
        </div>
        <button id="lp-submit-btn" type="submit">Submit</button>
      </form>
    </div>
    `

    modal.querySelector('#lp-close-btn button')?.addEventListener('click', () => {
      document.body.removeChild(modal)
    })

    modal.addEventListener('click', (event) => {
      if (event.target === modal) document.body.removeChild(modal)
    })

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && document.body.contains(modal)) {
        document.body.removeChild(modal)
      }
    })

    modal.querySelector('#lp-form')?.addEventListener('submit', async (event) => {
      event.preventDefault()
      await saveConfig(modal)
    })

    return modal
  }

  async function saveConfig(modal) {
    const repoUrlInput = modal.querySelector('#repo-url')
    const tokenInput = modal.querySelector('#token')
    const branchInput = modal.querySelector('input[name="branch-name"]:checked')
    const separateFolderInput = modal.querySelector('input[name="daily-challenge"]:checked')
    const customDirInput = modal.querySelector('#custom-dir')
    const shortcutModifierInput = modal.querySelector('#shortcut-modifier')
    const shortcutKeyInput = modal.querySelector('#shortcut-key')

    if (!repoUrlInput || !tokenInput || !branchInput || !separateFolderInput) return

    const githubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/
    if (!githubUrlPattern.test(repoUrlInput.value)) {
      showToast('Please enter a valid GitHub repository URL (https://github.com/username/repository).', 'error')
      return
    }

    if (!tokenInput.value.startsWith('ghp_') && !tokenInput.value.startsWith('github_pat_')) {
      showToast('Please enter a valid GitHub token. It should start with "ghp_" or "github_pat_".', 'error')
      return
    }

    const repoUrl = repoUrlInput.value.endsWith('.git')
      ? repoUrlInput.value.slice(0, -4)
      : repoUrlInput.value

    if (shortcutModifierInput && shortcutKeyInput && shortcutKeyInput.value) {
      KEYBOARD_SHORTCUT = {
        key: shortcutKeyInput.value.toLowerCase(),
        modifier: shortcutModifierInput.value,
      }
      SHORTCUT_DISPLAY = getShortcutDisplayText(KEYBOARD_SHORTCUT)
      localStorage.setItem('keyboard-shortcut', JSON.stringify(KEYBOARD_SHORTCUT))
      updateButtonLabels()
    }

    const pushModeInput = modal.querySelector('input[name="push-mode"]:checked')

    localStorage.setItem('repo', repoUrl)
    localStorage.setItem('token', tokenInput.value)
    localStorage.setItem('branch', branchInput.value)
    localStorage.setItem('separate-folder', separateFolderInput.value)
    localStorage.setItem('custom-dir', customDirInput?.value || '')
    localStorage.setItem('push-mode', pushModeInput?.value || 'single')

    document.body.removeChild(modal)

    try {
      await updateRepoDescription(tokenInput.value, repoUrl, branchInput.value)
    } catch (error) {
      console.error('LeetPush: error setting up repository metadata:', error)
      showToast('Initial repository setup failed. You may need to check your repository permissions.', 'error')
    }
  }

  function showConfigModal() {
    const modal = createConfigModal()

    const token = localStorage.getItem('token')
    const repo = localStorage.getItem('repo')
    const branch = localStorage.getItem('branch')
    const separateFolder = localStorage.getItem('separate-folder')
    const customDir = localStorage.getItem('custom-dir')

    const shortcutModifierInput = modal.querySelector('#shortcut-modifier')
    const shortcutKeyInput = modal.querySelector('#shortcut-key')

    if (shortcutModifierInput) shortcutModifierInput.value = KEYBOARD_SHORTCUT.modifier
    if (shortcutKeyInput) shortcutKeyInput.value = KEYBOARD_SHORTCUT.key.toUpperCase()

    const pushMode = localStorage.getItem('push-mode')

    if (token) modal.querySelector('#token').value = token
    if (repo) modal.querySelector('#repo-url').value = repo
    if (branch) modal.querySelector(`#branch-${branch}`).checked = true
    if (separateFolder) modal.querySelector(`#separate-folder-${separateFolder}`).checked = true
    if (customDir) modal.querySelector('#custom-dir').value = customDir
    if (pushMode) modal.querySelector(`#push-mode-${pushMode}`).checked = true

    document.body.appendChild(modal)
  }

  // ─── GitHub API ───────────────────────────────────────────────────────────

  function getGithubConfig() {
    return {
      token: localStorage.getItem('token') || '',
      repo: localStorage.getItem('repo') || '',
      branch: localStorage.getItem('branch') || '',
      separateFolder: localStorage.getItem('separate-folder') || '',
      customDir: localStorage.getItem('custom-dir') || '',
      pushMode: localStorage.getItem('push-mode') || 'single',
    }
  }

  function isConfigComplete(config) {
    return !!(config.token && config.repo && config.branch && config.separateFolder !== null)
  }

  function getPushButton() {
    return document.querySelector('#leetpush-btn') || document.querySelector('#leetpush-btn-CodeEditor')
  }

  async function handlePushClick() {
    const config = getGithubConfig()

    if (!isConfigComplete(config)) {
      showConfigModal()
      return
    }

    const pushBtn = getPushButton()
    if (!pushBtn) {
      showToast('Interface error: Push button not found. Please refresh the page and try again.', 'error')
      return
    }

    const problemInfo = await extractProblemInfo()
    if (!problemInfo) {
      showToast(
        'Failed to extract problem info. Make sure you are on an accepted submission page.',
        'error',
      )
      return
    }

    const { fileName, solution, commitMsg } = problemInfo
    if (!fileName || !solution || !commitMsg) {
      if (!fileName) showToast('Failed to generate a valid file name for your solution.', 'error')
      else if (!solution) showToast('Failed to extract your solution code. Please try again.', 'error')
      else showToast('Failed to generate commit message. Please try again.', 'error')
      return
    }

    const [userName, repoName] = config.repo.split('/').slice(3, 5)
    if (!userName || !repoName) {
      showToast(
        'Invalid repository URL format. Please check your settings.',
        'error',
      )
      showConfigModal()
      return
    }

    pushBtn.disabled = true
    pushBtn.textContent = 'Loading...'
    pushBtn.classList.add('loading')

    // Fetch full problem data only when folder mode is on
    let fullProblemData = null
    if (config.pushMode === 'folder') {
      const titleSlug = getProblemSlugFromURL()
      if (titleSlug) fullProblemData = await fetchFullProblemData(titleSlug)
      if (!fullProblemData) {
        showToast('Could not fetch problem description. Falling back to single-file mode.', 'info')
      }
    }

    try {
      await pushToGithub(
        userName,
        repoName,
        config.branch,
        fileName,
        solution,
        commitMsg,
        config.token,
        config.separateFolder,
        config.customDir,
        config.pushMode,
        problemInfo,
        fullProblemData,
      )

      pushBtn.classList.remove('loading')
      pushBtn.classList.add('success')
      pushBtn.textContent = 'Done'
      showToast('Solution pushed to GitHub!', 'success')

      const solutionsPushed = Number.parseInt(localStorage.getItem('solutions-pushed') || '0') + 1
      localStorage.setItem('solutions-pushed', solutionsPushed.toString())

      try {
        const [, dailyProblemNum] = await getDailyChallenge()
        if (dailyProblemNum === problemInfo.probNum) {
          const dailyChallenges = Number.parseInt(localStorage.getItem('daily-challenges') || '0') + 1
          localStorage.setItem('daily-challenges', dailyChallenges.toString())
        }
      } catch (error) {
        console.error('LeetPush: error checking daily challenge:', error)
      }

      await sleep(2000)
      pushBtn.disabled = false
      pushBtn.classList.remove('success')
      pushBtn.textContent = `Push (${SHORTCUT_DISPLAY})`
    } catch (error) {
      console.error('LeetPush: failed to push solution:', error)

      const errorMessage = error.message || ''
      const isAuthError =
        errorMessage.includes('401') ||
        errorMessage.includes('Authentication failed') ||
        errorMessage.includes('invalid or expired')

      if (isAuthError) {
        localStorage.removeItem('token')
        localStorage.removeItem('branch')
        showToast('Authentication failed. Your GitHub token is invalid or expired. Please enter a new token.', 'error')
        pushBtn.classList.remove('loading')
        pushBtn.disabled = false
        pushBtn.textContent = `Push (${SHORTCUT_DISPLAY})`
        showConfigModal()
      } else {
        showToast(errorMessage || 'Unknown error occurred while pushing solution.', 'error')
        pushBtn.classList.remove('loading')
        pushBtn.classList.add('error')
        pushBtn.textContent = 'Error'
        await sleep(2000)
        pushBtn.disabled = false
        pushBtn.classList.remove('error')
        pushBtn.textContent = `Push (${SHORTCUT_DISPLAY})`
      }
    }
  }

  async function resolveDailyPrefix(problemInfo, separateFolder) {
    if (separateFolder !== 'yes') return ''
    try {
      const [date, dailyProblemNum] = await getDailyChallenge()
      if (problemInfo && dailyProblemNum === problemInfo.probNum) {
        const splitDate = date.split('-')
        return `DCP-${splitDate[1]}-${splitDate[0].slice(2)}`
      }
    } catch (error) {
      console.error('LeetPush: error checking daily challenge folder:', error)
    }
    return ''
  }

  async function pushToGithub(
    userName,
    repoName,
    branch,
    fileName,
    content,
    commitMsg,
    token,
    separateFolder,
    customDir,
    pushMode,
    problemInfo,
    fullProblemData,
  ) {
    if (!fileName?.trim()) throw new Error('Invalid file name. Please try again.')
    if (!content?.trim()) throw new Error('No solution content found. Please make sure your solution is visible on the page.')

    const dailyPrefix = await resolveDailyPrefix(problemInfo, separateFolder)

    if (pushMode === 'folder' && fullProblemData) {
      // Build {id}-{slug} folder name
      const folderName = `${problemInfo.probNum}-${problemInfo.probName.toLowerCase()}`

      // Assemble path: [customDir/][dailyPrefix/]{id}-{slug}
      const parts = [customDir, dailyPrefix, folderName].filter(Boolean)
      const folderPath = parts.join('/')

      const readme = buildReadme(fullProblemData, fileName)
      return await pushFolderToRepo(userName, repoName, folderPath, branch, readme, content, fileName, commitMsg, token)
    }

    // Single-file mode
    const parts = [customDir, dailyPrefix, fileName].filter(Boolean)
    const filePath = parts.join('/')

    if (!filePath?.trim()) throw new Error('Failed to generate a valid file path. Please check your target directory settings.')
    return await pushFileToRepo(userName, repoName, filePath, branch, content, commitMsg, token)
  }

  async function pushFileToRepo(userName, repoName, filePath, branch, content, commitMsg, token) {
    const apiUrl = `${BASE_URL}/${userName}/${repoName}/contents/${filePath}`

    const repoCheckResponse = await fetch(`${BASE_URL}/${userName}/${repoName}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!repoCheckResponse.ok) {
      const errorData = await repoCheckResponse.json()
      if (repoCheckResponse.status === 404) {
        throw new Error(`Repository not found: ${userName}/${repoName}. Please check if the repository exists and your token has access to it.`)
      } else if (repoCheckResponse.status === 401) {
        throw new Error('Authentication failed. Your GitHub token may be invalid or expired.')
      } else if (repoCheckResponse.status === 403) {
        throw new Error('Access forbidden. Your token may not have sufficient permissions.')
      } else {
        throw new Error(`Repository access error: ${errorData.message || 'Unknown error'}`)
      }
    }

    const encodedContent = btoa(unescape(encodeURIComponent(content)))
    const requestBody = { message: commitMsg, content: encodedContent, branch }

    let fileExistsRes
    try {
      fileExistsRes = await fetch(`${apiUrl}?ref=${branch}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {
      throw new Error('Network error while checking if file already exists in repository.')
    }

    if (fileExistsRes.ok) {
      const existingFileData = await fileExistsRes.json()
      if (existingFileData?.sha) requestBody.sha = existingFileData.sha
    } else if (fileExistsRes.status !== 404) {
      const errorData = await fileExistsRes.json()
      if (fileExistsRes.status === 403) {
        throw new Error('Permission denied. Make sure your token has "contents: write" permission.')
      } else if (fileExistsRes.status === 401) {
        throw new Error('Authentication failed. Your GitHub token may be invalid or expired.')
      } else {
        throw new Error(`Error checking file: ${errorData.message || 'Unknown error'}`)
      }
    }

    let response = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(requestBody),
    })

    // Retry on SHA mismatch (409)
    let retries = 0
    while (response.status === 409 && retries < 3) {
      retries++
      try {
        const latestRes = await fetch(`${apiUrl}?ref=${branch}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!latestRes.ok) break
        const latestData = await latestRes.json()
        if (!latestData?.sha) break
        requestBody.sha = latestData.sha
        response = await fetch(apiUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(requestBody),
        })
        if (response.ok) break
      } catch {
        break
      }
      await sleep(500)
    }

    if (!response.ok) {
      let msg = `GitHub API Error: ${response.status}`
      try {
        const err = await response.json()
        msg += ` — ${err.message || 'Unknown error'}`
      } catch { /* ignore */ }
      throw new Error(msg)
    }

    return true
  }

  async function pushFolderToRepo(userName, repoName, folderPath, branch, readmeContent, solutionContent, solutionFileName, commitMsg, token) {
    const apiBase = `${BASE_URL}/${userName}/${repoName}`

    // 1. Get latest commit SHA for the branch
    const refRes = await fetch(`${apiBase}/git/ref/heads/${branch}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!refRes.ok) {
      const err = await refRes.json()
      if (refRes.status === 401) throw new Error('Authentication failed. Your GitHub token may be invalid or expired.')
      if (refRes.status === 404) throw new Error(`Branch "${branch}" not found in ${userName}/${repoName}.`)
      throw new Error(`Failed to get branch ref: ${err.message || refRes.status}`)
    }
    const refData = await refRes.json()
    const latestCommitSha = refData.object.sha

    // 2. Get base tree SHA from commit
    const commitRes = await fetch(`${apiBase}/git/commits/${latestCommitSha}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!commitRes.ok) throw new Error('Failed to fetch latest commit data.')
    const commitData = await commitRes.json()
    const baseTreeSha = commitData.tree.sha

    // 3. Create blobs
    const createBlob = async (content) => {
      const res = await fetch(`${apiBase}/git/blobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: btoa(unescape(encodeURIComponent(content))), encoding: 'base64' }),
      })
      if (!res.ok) throw new Error('Failed to create file blob on GitHub.')
      const data = await res.json()
      return data.sha
    }

    const [readmeSha, solutionSha] = await Promise.all([
      createBlob(readmeContent),
      createBlob(solutionContent),
    ])

    // 4. Create new tree with both files
    const treeRes = await fetch(`${apiBase}/git/trees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: [
          { path: `${folderPath}/README.md`, mode: '100644', type: 'blob', sha: readmeSha },
          { path: `${folderPath}/${solutionFileName}`, mode: '100644', type: 'blob', sha: solutionSha },
        ],
      }),
    })
    if (!treeRes.ok) throw new Error('Failed to create Git tree on GitHub.')
    const treeData = await treeRes.json()

    // 5. Create commit
    const newCommitRes = await fetch(`${apiBase}/git/commits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        message: commitMsg,
        tree: treeData.sha,
        parents: [latestCommitSha],
      }),
    })
    if (!newCommitRes.ok) throw new Error('Failed to create Git commit on GitHub.')
    const newCommitData = await newCommitRes.json()

    // 6. Update branch ref
    const updateRes = await fetch(`${apiBase}/git/refs/heads/${branch}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sha: newCommitData.sha }),
    })
    if (!updateRes.ok) {
      const err = await updateRes.json()
      throw new Error(`Failed to update branch: ${err.message || updateRes.status}`)
    }

    return true
  }

  async function updateRepoDescription(token, repo, branch) {
    const [userName, repoName] = repo.split('/').slice(3, 5)
    try {
      await fetch(`${BASE_URL}/${userName}/${repoName}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          description: 'This repository is managed by LeetPush extension: https://github.com/LeetPushExtension/LeetPush',
        }),
      })
    } catch (error) {
      console.error('LeetPush: error updating repo metadata:', error)
    }
  }

  async function getDailyChallenge() {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          activeDailyCodingChallengeQuestion {
            date
            question { frontendQuestionId: questionFrontendId }
          }
        }`,
      }),
    })
    const data = await response.json()
    const q = data.data.activeDailyCodingChallengeQuestion
    return [q.date, q.question.frontendQuestionId]
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  function initLeetPush() {
    if (isSubmissionPage() && hasAcceptedSolution()) {
      injectButtons()
      extractProblemInfo()
      registerKeyboardShortcut()
    }
  }

  injectToastStyles()
  initLeetPush()

  const observer = new MutationObserver(() => {
    if (isSubmissionPage() && hasAcceptedSolution()) {
      const hasButtons =
        document.getElementById('leetpush-btn') ||
        document.getElementById('leetpush-btn-CodeEditor')
      if (!hasButtons) initLeetPush()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
})()
