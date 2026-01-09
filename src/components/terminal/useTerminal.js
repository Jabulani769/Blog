// src/components/terminal/useTerminal.js

export function useTerminal({ output, input, onCommand }) {
  const history = [];
  let historyIndex = -1;

  const postSlugs = window.blogPosts?.map(p => p.slug) || [];

  const commands = {
    help: () => {
      const lines = [
        '<span class="text-cyan-300">Available commands:</span>',
        "",
        ' <br> &nbsp;&nbsp; - <span class="text-yellow-400">ls</span> List all blog posts',
        ' <br> &nbsp;&nbsp; - <span class="text-yellow-400">cat</span> <slug> Preview a post summary',
        ' <br> &nbsp;&nbsp; - <span class="text-yellow-400">open</span> <slug> Open full post in GUI',
        ' <br> &nbsp;&nbsp; - <span class="text-yellow-400">share</span> <slug> Copy post link',
        ' <br> &nbsp;&nbsp; - <span class="text-yellow-400">clear</span> Clear the terminal',
        ' <br> &nbsp;&nbsp; - <span class="text-yellow-400">gui</span> Switch to GUI mode',
        ' <br> &nbsp;&nbsp; - <span class="text-yellow-400">help</span> Show this help message',
        ' <br> &nbsp;&nbsp; - <span class="text-yellow-400">neofetch</span> Display system info',
        "",
        ' <br> <span class="text-green-400">Tip:</span> <br> &nbsp;&nbsp; • Tab for autocomplete <br> &nbsp;&nbsp;&nbsp;• ↑/↓ for history',
      ];
      return lines.join("\n");
    },
    ls: () => window.blogPosts?.map(p => `${p.slug.padEnd(35)} (${p.pubDate})`).join("\n") || "No posts found",
    cat: (args = []) => {
      if (!args[0]) return "Usage: cat <post-slug>";
      const post = window.blogPosts?.find(p => p.slug === args[0]);
      if (!post) return `cat: ${args[0]}: No such file or directory\nHint: Use 'ls'`;
      let out = `
<span class="text-cyan-300 font-bold text-lg">${post.title}</span>
<span class="text-gray-500 text-sm">${post.pubDate} • jabublog@root</span>
`;
      if (post.image) out += `<span class="text-yellow-300">[Image: ${post.image}]</span>\n\n`;
      if (post.description) out += `${post.description}\n\n`;
      out += `
<span class="text-green-400">>>> Full post available in GUI</span>
<span class="text-yellow-300">Tip: open ${post.slug}</span>
<span class="text-gray-500">~ preview of ${args[0]} ~</span>
      `.trim();
      return out;
    },
    open: (args = []) => {
      if (!args[0]) return "Usage: open <post-slug>";
      const post = window.blogPosts?.find(p => p.slug === args[0]);
      if (!post) return `open: No such file "${args[0]}"`;
      window.location.href = `/blog/${args[0]}`;
      return `Opening "${post.title}"...`;
    },
    share: (args = []) => {
      if (!args[0]) return "Usage: share <post-slug>";
      const post = window.blogPosts?.find(p => p.slug === args[0]);
      if (!post) return `share: No such post "${args[0]}"`;
      const url = `${window.location.origin}/blog/${args[0]}`;
      navigator.clipboard.writeText(url).then(() => {
        onCommand(`<span class="text-green-400">✓ Link copied!</span>\n${url}`);
      });
      return "";
    },
    clear: () => {
      if (output) output.innerHTML = "";
      return "";
    },
    gui: () => {
      const event = new CustomEvent('toggle-gui');
      document.dispatchEvent(event);
      return "Switching to GUI...";
    },
    neofetch: () => {
      const uptimeMinutes = Math.floor((Date.now() - window.loadTime) / 60000);
      const uptime = uptimeMinutes < 60 
        ? `${uptimeMinutes}m` 
        : `${Math.floor(uptimeMinutes / 60)}h ${uptimeMinutes % 60}m`;

      const asciiArt = `
<span class="text-cyan-400">     ██╗ █████╗ ██████╗ ██╗   ██╗</span>
<span class="text-cyan-400">     ██║██╔══██╗██╔══██╗██║   ██║</span>
<span class="text-cyan-300">     ██║███████║██████╔╝██║   ██║</span>
<span class="text-cyan-300">██   ██║██╔══██║██╔══██╗██║   ██║</span>
<span class="text-cyan-400">╚█████╔╝██║  ██║██████╔╝╚██████╔╝</span>
<span class="text-cyan-400"> ╚════╝ ╚═╝  ╚═╝╚═════╝  ╚═════╝ </span>
      `.trim();

      const info = `
<span class="text-cyan-300">jabu@jabublog</span>
<span class="text-gray-500">────────────────</span>
<span class="text-yellow-400">OS:</span> jabublog OS (Astro)
<span class="text-yellow-400">Host:</span> localhost
<span class="text-yellow-400">Uptime:</span> ${uptime}
<span class="text-yellow-400">Posts:</span> ${window.blogPosts?.length || 0}
<span class="text-yellow-400">Shell:</span> jabush v0.1

<span class="text-cyan-400">███</span><span class="text-blue-500">███</span><span class="text-magenta-400">███</span><span class="text-red-500">███</span><span class="text-yellow-300">███</span><span class="text-green-400">███</span>
      `.trim();

      return `
<div class="flex flex-col md:flex-row gap-10 items-start">
  <pre class="font-mono text-sm leading-tight">${asciiArt}</pre>
  <pre class="font-mono text-sm leading-tight">${info}</pre>
</div>
      `;
    },
  };

  function autocomplete() {
    if (!input) return;
    const value = input.value;
    const cursor = input.selectionStart ?? value.length;
    const beforeCursor = value.slice(0, cursor);
    if (!beforeCursor.includes(" ")) return;
    const parts = beforeCursor.split(" ");
    if (parts.length !== 2) return;
    const slugPart = parts[1].toLowerCase();
    const matches = postSlugs.filter(slug => slug.toLowerCase().startsWith(slugPart));
    if (!matches.length) return;
    if (matches.length === 1) {
      input.value = parts[0] + " " + matches[0] + " ";
    } else {
      onCommand(`<span class="text-gray-400">${matches.join(" ")}</span>`);
    }
  }

  async function bootAnimation() {
    if (!output || !input) return;
    output.innerHTML = "";
    input.style.display = "none";

    const bootLines = [
      '<span class="text-green-400">Linux 6.6.0-jabublog (jabu@root)</span>',
      "Mounting /blog... OK",
      `Loading posts... ${window.blogPosts?.length || 0} found`,
      "",
      '--> Type <span class="text-yellow-400">help</span> • Tab for autocomplete • ↑/↓ for history',
    ];

    for (const line of bootLines) {
      onCommand(line);
      await new Promise(r => setTimeout(r, 120));
    }

    input.style.display = "block";
    input.focus();
  }

  // Live clock
  function updateClock() {
    const clockEl = document.getElementById("live-clock");
    if (!clockEl) return;
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formatted = `${days[now.getDay()]} Jan ${now.getDate().toString().padStart(2, '0')} ` +
      `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} CAT ${now.getFullYear()}`;
    clockEl.textContent = formatted;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Setup input events
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmdLine = input.value.trim();
      if (cmdLine) {
        if (history.at(-1) !== cmdLine) history.push(cmdLine);
        historyIndex = history.length;
        onCommand(cmdLine, true);
        const [cmd, ...args] = cmdLine.split(" ");
        const handler = commands[cmd];
        if (handler) {
          const result = handler(args);
          if (result) onCommand(result);
        } else {
          onCommand(`<span class="text-red-400">bash: ${cmd}: command not found</span>`);
        }
      }
      input.value = "";
    } else if (e.key === "ArrowUp" && historyIndex > 0) {
      e.preventDefault();
      input.value = history[--historyIndex];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      historyIndex < history.length - 1
        ? (input.value = history[++historyIndex])
        : ((historyIndex = history.length), (input.value = ""));
    } else if (e.key === "Tab") {
      e.preventDefault();
      autocomplete();
    }
  });

  return { bootAnimation };
}