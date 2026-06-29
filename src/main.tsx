import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  Bot,
  Brain,
  ChevronDown,
  CircleDot,
  Database,
  GitBranch,
  Keyboard,
  Lock,
  Plus,
  Radio,
  Send,
  Shield,
  Sparkles,
  TerminalSquare,
  ToggleLeft,
  ToggleRight,
  Unlock,
  Wrench
} from "lucide-react";
import "./styles.css";

type RuntimeKind = "acp" | "mcp" | "skills";
type PanelSide = "center" | "left" | "right";

interface Agent {
  id: string;
  name: string;
  adapter: string;
  model: string;
  panel: string;
  side: PanelSide;
  status: "ready" | "running" | "waiting" | "blocked";
  sessionId: string;
  permission: number;
  accent: string;
  mcpServers: McpServer[];
  skills: Skill[];
  peerEdges: PeerEdge[];
  log: string[];
}

interface McpServer {
  id: string;
  name: string;
  transport: string;
  enabled: boolean;
  health: "ok" | "idle" | "warn" | "blocked";
  tools: Tool[];
  lastCall: string;
}

interface Tool {
  name: string;
  kind: "read" | "write" | "network" | "sensitive";
  enabled: boolean;
}

interface Skill {
  id: string;
  name: string;
  source: string;
  enabled: boolean;
  pinned: boolean;
  trust: "trusted" | "review" | "blocked";
  lastUsed: string;
}

interface PeerEdge {
  id: string;
  target: string;
  action: string;
  state: "queued" | "running" | "done";
}

interface RuntimePanelState {
  locked: boolean;
  selectedAgentId: string;
}

const initialAgents: Agent[] = [
  {
    id: "claude",
    name: "Claude",
    adapter: "ACP adapter",
    model: "Sonnet workspace",
    panel: "Panel 1",
    side: "center",
    status: "ready",
    sessionId: "sess_claude_019",
    permission: 3,
    accent: "#48c78e",
    mcpServers: [
      {
        id: "github",
        name: "GitHub",
        transport: "stdio",
        enabled: true,
        health: "ok",
        lastCall: "review PR metadata",
        tools: [
          { name: "issues.read", kind: "read", enabled: true },
          { name: "pulls.write", kind: "write", enabled: false }
        ]
      },
      {
        id: "playwright",
        name: "Playwright",
        transport: "stdio",
        enabled: false,
        health: "idle",
        lastCall: "no call",
        tools: [
          { name: "browser.open", kind: "network", enabled: false },
          { name: "screenshot", kind: "read", enabled: true }
        ]
      }
    ],
    skills: [
      {
        id: "recall",
        name: "Recall",
        source: "~/.codex/skills",
        enabled: true,
        pinned: false,
        trust: "trusted",
        lastUsed: "compile packet"
      },
      {
        id: "security",
        name: "Security Review",
        source: "curated",
        enabled: false,
        pinned: false,
        trust: "review",
        lastUsed: "never"
      }
    ],
    peerEdges: [
      { id: "edge-1", target: "Codex", action: "handoff diff", state: "done" },
      { id: "edge-2", target: "Review", action: "risk pass", state: "queued" }
    ],
    log: ["ACP session ready", "Memory preflight clean", "MCP GitHub enabled"]
  },
  {
    id: "codex",
    name: "Codex",
    adapter: "ACP bridge",
    model: "GPT coding agent",
    panel: "Panel 2",
    side: "center",
    status: "running",
    sessionId: "sess_codex_044",
    permission: 2,
    accent: "#63a4ff",
    mcpServers: [
      {
        id: "filesystem",
        name: "Filesystem",
        transport: "client",
        enabled: true,
        health: "ok",
        lastCall: "read src/App.tsx",
        tools: [
          { name: "fs.read", kind: "read", enabled: true },
          { name: "fs.write", kind: "write", enabled: true }
        ]
      },
      {
        id: "terminal",
        name: "Terminal",
        transport: "client",
        enabled: true,
        health: "warn",
        lastCall: "npm run build",
        tools: [
          { name: "terminal.create", kind: "write", enabled: true },
          { name: "terminal.kill", kind: "sensitive", enabled: false }
        ]
      }
    ],
    skills: [
      {
        id: "figma",
        name: "Figma",
        source: "plugin",
        enabled: false,
        pinned: false,
        trust: "review",
        lastUsed: "design read"
      },
      {
        id: "playwright",
        name: "Playwright QA",
        source: "~/.codex/skills",
        enabled: true,
        pinned: true,
        trust: "trusted",
        lastUsed: "UI smoke"
      }
    ],
    peerEdges: [
      { id: "edge-3", target: "Claude", action: "context check", state: "running" }
    ],
    log: ["Prompt turn active", "Tool call visible", "Waiting for file write receipt"]
  },
  {
    id: "gemini",
    name: "Gemini",
    adapter: "desktop import",
    model: "CLI agent",
    panel: "Panel 3",
    side: "left",
    status: "waiting",
    sessionId: "sess_gemini_221",
    permission: 1,
    accent: "#f0b85a",
    mcpServers: [
      {
        id: "docs",
        name: "Docs Search",
        transport: "http",
        enabled: false,
        health: "idle",
        lastCall: "no call",
        tools: [
          { name: "docs.search", kind: "network", enabled: true },
          { name: "docs.fetch", kind: "read", enabled: true }
        ]
      }
    ],
    skills: [
      {
        id: "docs",
        name: "Docs First",
        source: "desktop profile",
        enabled: true,
        pinned: false,
        trust: "review",
        lastUsed: "adapter import"
      }
    ],
    peerEdges: [
      { id: "edge-4", target: "Codex", action: "API check", state: "queued" }
    ],
    log: ["Imported disabled MCP candidates", "Waiting for approval"]
  },
  {
    id: "review",
    name: "Review",
    adapter: "local agent",
    model: "Risk checker",
    panel: "Panel 4",
    side: "right",
    status: "ready",
    sessionId: "sess_review_116",
    permission: 2,
    accent: "#ff7875",
    mcpServers: [
      {
        id: "git",
        name: "Git",
        transport: "stdio",
        enabled: true,
        health: "ok",
        lastCall: "diff --stat",
        tools: [
          { name: "git.diff", kind: "read", enabled: true },
          { name: "git.commit", kind: "write", enabled: false }
        ]
      }
    ],
    skills: [
      {
        id: "code-review",
        name: "Code Review",
        source: "curated",
        enabled: true,
        pinned: true,
        trust: "trusted",
        lastUsed: "finding pass"
      }
    ],
    peerEdges: [
      { id: "edge-5", target: "Claude", action: "findings", state: "done" }
    ],
    log: ["Review mode", "No hidden writes", "Audit compact rows active"]
  }
];

const agentPool: Agent[] = [
  {
    id: "solver",
    name: "Solver",
    adapter: "local ACP",
    model: "Heuristic worker",
    panel: "Panel 5",
    side: "right",
    status: "ready",
    sessionId: "sess_solver_302",
    permission: 2,
    accent: "#b28dff",
    mcpServers: [
      {
        id: "qubo",
        name: "QUBO",
        transport: "stdio",
        enabled: false,
        health: "idle",
        lastCall: "no call",
        tools: [
          { name: "qubo.coverage", kind: "read", enabled: true },
          { name: "qubo.optimize", kind: "write", enabled: false }
        ]
      }
    ],
    skills: [
      {
        id: "solver-plan",
        name: "Solver Plan",
        source: "local",
        enabled: true,
        pinned: false,
        trust: "review",
        lastUsed: "not used"
      }
    ],
    peerEdges: [{ id: "edge-6", target: "Codex", action: "coverage route", state: "queued" }],
    log: ["Imported from desktop profile", "Disabled network tools"]
  },
  {
    id: "lattice",
    name: "Lattice",
    adapter: "local ACP",
    model: "Structure mapper",
    panel: "Panel 6",
    side: "left",
    status: "ready",
    sessionId: "sess_lattice_411",
    permission: 1,
    accent: "#72d6c9",
    mcpServers: [
      {
        id: "graph",
        name: "Graph",
        transport: "stdio",
        enabled: true,
        health: "ok",
        lastCall: "scope graph",
        tools: [
          { name: "graph.read", kind: "read", enabled: true },
          { name: "graph.write", kind: "write", enabled: false }
        ]
      }
    ],
    skills: [
      {
        id: "blast-radius",
        name: "Blast Radius",
        source: "local",
        enabled: true,
        pinned: true,
        trust: "trusted",
        lastUsed: "workspace scan"
      }
    ],
    peerEdges: [{ id: "edge-7", target: "Review", action: "risk surface", state: "done" }],
    log: ["Workspace graph online", "Permission 1"]
  }
];

function App() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [focusedAgentId, setFocusedAgentId] = useState(initialAgents[0].id);
  const [runtimePanels, setRuntimePanels] = useState<Record<RuntimeKind, RuntimePanelState>>({
    acp: { locked: false, selectedAgentId: initialAgents[0].id },
    mcp: { locked: false, selectedAgentId: initialAgents[0].id },
    skills: { locked: false, selectedAgentId: initialAgents[0].id }
  });
  const [tabChord, setTabChord] = useState(false);
  const [toast, setToast] = useState("Runtime panels follow Claude");
  const focusedAgent = agents.find((agent) => agent.id === focusedAgentId) ?? agents[0];

  const selectAgent = useCallback(
    (agentId: string, source: "focus" | "shortcut") => {
      const agent = agents.find((candidate) => candidate.id === agentId);
      if (!agent) return;

      setFocusedAgentId(agentId);
      setRuntimePanels((current) => {
        const next = { ...current };
        (Object.keys(next) as RuntimeKind[]).forEach((kind) => {
          if (!next[kind].locked) {
            next[kind] = { ...next[kind], selectedAgentId: agentId };
          }
        });
        return next;
      });
      setToast(
        source === "shortcut"
          ? `Focused ${agent.name} from Tab+${agents.indexOf(agent) === 9 ? 0 : agents.indexOf(agent) + 1}; unlocked runtime tabs followed`
          : `Focused ${agent.name}; unlocked runtime tabs followed`
      );
    },
    [agents]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const inTextInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable === true;

      if (event.key === "Tab" && !inTextInput) {
        event.preventDefault();
        setTabChord(true);
      }

      if (tabChord && /^[0-9]$/.test(event.key)) {
        event.preventDefault();
        const index = event.key === "0" ? 9 : Number(event.key) - 1;
        const agent = agents[index];
        if (agent) {
          selectAgent(agent.id, "shortcut");
        }
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        setTabChord(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [agents, selectAgent, tabChord]);

  const setRuntimeSelected = (kind: RuntimeKind, agentId: string) => {
    setRuntimePanels((current) => ({
      ...current,
      [kind]: { ...current[kind], selectedAgentId: agentId }
    }));
    setFocusedAgentId(agentId);
    const agent = agents.find((candidate) => candidate.id === agentId);
    setToast(`${runtimeTitle(kind)} tab selected${agent ? `: ${agent.name}` : ""}`);
  };

  const toggleRuntimeLock = (kind: RuntimeKind) => {
    setRuntimePanels((current) => {
      const wasLocked = current[kind].locked;
      const selectedAgentId = wasLocked ? focusedAgentId : current[kind].selectedAgentId;
      return {
        ...current,
        [kind]: {
          locked: !wasLocked,
          selectedAgentId
        }
      };
    });
    setToast(`${runtimeTitle(kind)} ${runtimePanels[kind].locked ? "following focus" : "locked"}`);
  };

  const toggleServer = (agentId: string, serverId: string) => {
    setAgents((currentAgents) =>
      currentAgents.map((agent) =>
        agent.id !== agentId
          ? agent
          : {
              ...agent,
              mcpServers: agent.mcpServers.map((server) =>
                server.id === serverId ? { ...server, enabled: !server.enabled } : server
              )
            }
      )
    );
  };

  const toggleTool = (agentId: string, serverId: string, toolName: string) => {
    setAgents((currentAgents) =>
      currentAgents.map((agent) =>
        agent.id !== agentId
          ? agent
          : {
              ...agent,
              mcpServers: agent.mcpServers.map((server) =>
                server.id !== serverId
                  ? server
                  : {
                      ...server,
                      tools: server.tools.map((tool) =>
                        tool.name === toolName ? { ...tool, enabled: !tool.enabled } : tool
                      )
                    }
              )
            }
      )
    );
  };

  const toggleSkill = (agentId: string, skillId: string, field: "enabled" | "pinned") => {
    setAgents((currentAgents) =>
      currentAgents.map((agent) =>
        agent.id !== agentId
          ? agent
          : {
              ...agent,
              skills: agent.skills.map((skill) =>
                skill.id === skillId ? { ...skill, [field]: !skill[field] } : skill
              )
            }
      )
    );
  };

  const addAgent = () => {
    const available = agentPool.find((agent) => !agents.some((existing) => existing.id === agent.id));
    if (!available) {
      setToast("No more imported agent candidates in this demo");
      return;
    }
    setAgents((current) => [...current, available]);
    setRuntimePanels((current) => {
      const next = { ...current };
      (Object.keys(next) as RuntimeKind[]).forEach((kind) => {
        if (!next[kind].locked) {
          next[kind] = { ...next[kind], selectedAgentId: available.id };
        }
      });
      return next;
    });
    setFocusedAgentId(available.id);
    setToast(`Attached ${available.name}; runtime tabs added`);
  };

  const selectedAgentsByRuntime = useMemo(
    () => ({
      acp: agents.find((agent) => agent.id === runtimePanels.acp.selectedAgentId) ?? focusedAgent,
      mcp: agents.find((agent) => agent.id === runtimePanels.mcp.selectedAgentId) ?? focusedAgent,
      skills: agents.find((agent) => agent.id === runtimePanels.skills.selectedAgentId) ?? focusedAgent
    }),
    [agents, focusedAgent, runtimePanels]
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src="/assets/dd-mark.svg" alt="" className="dd-mark" />
          <div>
            <div className="eyebrow">AIDDE</div>
            <h1>Runtime panel prototype</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <div className={`tab-chord ${tabChord ? "active" : ""}`}>
            <Keyboard size={15} />
            <span>{tabChord ? "Tab held" : "Tab chord"}</span>
          </div>
          <button className="button primary" type="button" onClick={addAgent}>
            <Plus size={16} />
            Agent
          </button>
        </div>
      </header>

      <section className="workspace">
        <section className="agents-area">
          <div className="section-title">
            <Bot size={16} />
            <span>Agent windows</span>
            <small>{agents.length} live</small>
          </div>
          <div className="agent-grid">
            {agents.map((agent, index) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                index={index}
                focused={agent.id === focusedAgentId}
                onFocus={() => selectAgent(agent.id, "focus")}
              />
            ))}
          </div>
        </section>

        <section className="runtime-column">
          <RuntimePanel
            kind="acp"
            agents={agents}
            panelState={runtimePanels.acp}
            selectedAgent={selectedAgentsByRuntime.acp}
            focusedAgentId={focusedAgentId}
            onSelectAgent={(agentId) => setRuntimeSelected("acp", agentId)}
            onToggleLock={() => toggleRuntimeLock("acp")}
          />
          <RuntimePanel
            kind="mcp"
            agents={agents}
            panelState={runtimePanels.mcp}
            selectedAgent={selectedAgentsByRuntime.mcp}
            focusedAgentId={focusedAgentId}
            onSelectAgent={(agentId) => setRuntimeSelected("mcp", agentId)}
            onToggleLock={() => toggleRuntimeLock("mcp")}
            onToggleServer={toggleServer}
            onToggleTool={toggleTool}
          />
          <RuntimePanel
            kind="skills"
            agents={agents}
            panelState={runtimePanels.skills}
            selectedAgent={selectedAgentsByRuntime.skills}
            focusedAgentId={focusedAgentId}
            onSelectAgent={(agentId) => setRuntimeSelected("skills", agentId)}
            onToggleLock={() => toggleRuntimeLock("skills")}
            onToggleSkill={toggleSkill}
          />
        </section>
      </section>

      <footer className="command-rail">
        <div className="rail-agent" style={{ "--accent": focusedAgent.accent } as React.CSSProperties}>
          <CircleDot size={15} />
          <span>{focusedAgent.name}</span>
        </div>
        <div className="chips">
          {focusedAgent.mcpServers
            .filter((server) => server.enabled)
            .map((server) => (
              <span className="chip" key={server.id}>
                <Wrench size={13} />
                {server.name}
              </span>
            ))}
          {focusedAgent.skills
            .filter((skill) => skill.enabled)
            .map((skill) => (
              <span className="chip" key={skill.id}>
                <Brain size={13} />
                {skill.name}
              </span>
            ))}
        </div>
        <input aria-label="Command input" placeholder="Ask anything..." />
        <button className="send-button" type="button" onClick={() => setToast(`Prompt queued for ${focusedAgent.name}`)}>
          <Send size={16} />
        </button>
      </footer>

      <div className="toast">{toast}</div>
    </main>
  );
}

function AgentCard({
  agent,
  index,
  focused,
  onFocus
}: {
  agent: Agent;
  index: number;
  focused: boolean;
  onFocus: () => void;
}) {
  const enabledServers = agent.mcpServers.filter((server) => server.enabled).length;
  const enabledSkills = agent.skills.filter((skill) => skill.enabled).length;

  return (
    <button
      type="button"
      className={`agent-card ${focused ? "focused" : ""}`}
      style={{ "--accent": agent.accent } as React.CSSProperties}
      onClick={onFocus}
    >
      <div className="agent-card-header">
        <span className="agent-number">{index === 9 ? 0 : index + 1}</span>
        <div>
          <h2>{agent.name}</h2>
          <p>{agent.panel}</p>
        </div>
        <span className={`status ${agent.status}`}>{agent.status}</span>
      </div>
      <div className="agent-meta">
        <span>{agent.adapter}</span>
        <span>{agent.sessionId}</span>
      </div>
      <div className="agent-counts">
        <span>
          <Wrench size={14} />
          {enabledServers}/{agent.mcpServers.length}
        </span>
        <span>
          <Brain size={14} />
          {enabledSkills}/{agent.skills.length}
        </span>
        <span>
          <Shield size={14} />
          {agent.permission}
        </span>
      </div>
      <div className="agent-log">
        {agent.log.slice(0, 3).map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </button>
  );
}

function RuntimePanel({
  kind,
  agents,
  panelState,
  selectedAgent,
  focusedAgentId,
  onSelectAgent,
  onToggleLock,
  onToggleServer,
  onToggleTool,
  onToggleSkill
}: {
  kind: RuntimeKind;
  agents: Agent[];
  panelState: RuntimePanelState;
  selectedAgent: Agent;
  focusedAgentId: string;
  onSelectAgent: (agentId: string) => void;
  onToggleLock: () => void;
  onToggleServer?: (agentId: string, serverId: string) => void;
  onToggleTool?: (agentId: string, serverId: string, toolName: string) => void;
  onToggleSkill?: (agentId: string, skillId: string, field: "enabled" | "pinned") => void;
}) {
  const icon = runtimeIcon(kind);
  return (
    <article className={`runtime-panel ${kind}`}>
      <header className="runtime-header">
        <div className="runtime-title">
          {icon}
          <div>
            <h2>{runtimeTitle(kind)}</h2>
            <p>{panelState.locked ? `locked to ${selectedAgent.name}` : `following ${agentName(focusedAgentId, agents)}`}</p>
          </div>
        </div>
        <button className={`lock-button ${panelState.locked ? "locked" : ""}`} type="button" onClick={onToggleLock}>
          {panelState.locked ? <Lock size={15} /> : <Unlock size={15} />}
          {panelState.locked ? "Locked" : "Follow"}
        </button>
      </header>

      <div className="agent-tabs" role="tablist" aria-label={`${runtimeTitle(kind)} agent tabs`}>
        {agents.map((agent, index) => (
          <button
            type="button"
            key={agent.id}
            className={`agent-tab ${selectedAgent.id === agent.id ? "selected" : ""} ${
              focusedAgentId === agent.id ? "focused-agent" : ""
            }`}
            onClick={() => onSelectAgent(agent.id)}
            style={{ "--accent": agent.accent } as React.CSSProperties}
          >
            <span>{index === 9 ? 0 : index + 1}</span>
            {agent.name}
          </button>
        ))}
      </div>

      <section className="runtime-body">
        {kind === "acp" && <AcpRuntime agent={selectedAgent} />}
        {kind === "mcp" && onToggleServer && onToggleTool && (
          <McpRuntime agent={selectedAgent} onToggleServer={onToggleServer} onToggleTool={onToggleTool} />
        )}
        {kind === "skills" && onToggleSkill && <SkillsRuntime agent={selectedAgent} onToggleSkill={onToggleSkill} />}
      </section>
    </article>
  );
}

function AcpRuntime({ agent }: { agent: Agent }) {
  return (
    <div className="acp-layout">
      <div className="protocol-card">
        <span>session</span>
        <strong>{agent.sessionId}</strong>
      </div>
      <div className="protocol-card">
        <span>permission</span>
        <strong>{agent.permission}</strong>
      </div>
      <div className="protocol-card">
        <span>adapter</span>
        <strong>{agent.adapter}</strong>
      </div>
      <div className="peer-list">
        {agent.peerEdges.map((edge) => (
          <div className="peer-edge" key={edge.id}>
            <GitBranch size={15} />
            <div>
              <strong>{edge.target}</strong>
              <span>{edge.action}</span>
            </div>
            <em>{edge.state}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

function McpRuntime({
  agent,
  onToggleServer,
  onToggleTool
}: {
  agent: Agent;
  onToggleServer: (agentId: string, serverId: string) => void;
  onToggleTool: (agentId: string, serverId: string, toolName: string) => void;
}) {
  return (
    <div className="stack">
      {agent.mcpServers.map((server) => (
        <section className={`server-card ${server.enabled ? "enabled" : "disabled"}`} key={server.id}>
          <div className="server-header">
            <div>
              <h3>{server.name}</h3>
              <p>
                {server.transport} / {server.health} / {server.lastCall}
              </p>
            </div>
            <button className="toggle-button" type="button" onClick={() => onToggleServer(agent.id, server.id)}>
              {server.enabled ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              {server.enabled ? "Enabled" : "Disabled"}
            </button>
          </div>
          <div className="tool-grid">
            {server.tools.map((tool) => (
              <button
                className={`tool-pill ${tool.enabled ? "enabled" : "disabled"}`}
                key={tool.name}
                type="button"
                onClick={() => onToggleTool(agent.id, server.id, tool.name)}
              >
                <span>{tool.name}</span>
                <em>{tool.kind}</em>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SkillsRuntime({
  agent,
  onToggleSkill
}: {
  agent: Agent;
  onToggleSkill: (agentId: string, skillId: string, field: "enabled" | "pinned") => void;
}) {
  return (
    <div className="stack">
      {agent.skills.map((skill) => (
        <section className={`skill-card ${skill.enabled ? "enabled" : "disabled"}`} key={skill.id}>
          <div>
            <h3>{skill.name}</h3>
            <p>
              {skill.source} / {skill.trust} / {skill.lastUsed}
            </p>
          </div>
          <div className="skill-actions">
            <button className="toggle-button" type="button" onClick={() => onToggleSkill(agent.id, skill.id, "enabled")}>
              {skill.enabled ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              {skill.enabled ? "Enabled" : "Disabled"}
            </button>
            <button className={`pin-button ${skill.pinned ? "pinned" : ""}`} type="button" onClick={() => onToggleSkill(agent.id, skill.id, "pinned")}>
              <Sparkles size={15} />
              {skill.pinned ? "Pinned" : "Pin"}
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}

function runtimeTitle(kind: RuntimeKind) {
  if (kind === "acp") return "ACP Runtime";
  if (kind === "mcp") return "MCP Runtime";
  return "Skills Runtime";
}

function runtimeIcon(kind: RuntimeKind) {
  if (kind === "acp") return <Radio size={18} />;
  if (kind === "mcp") return <Database size={18} />;
  return <Brain size={18} />;
}

function agentName(agentId: string, agents: Agent[]) {
  return agents.find((agent) => agent.id === agentId)?.name ?? "none";
}

declare global {
  interface Window {
    __aiddeRoot?: Root;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

window.__aiddeRoot = window.__aiddeRoot ?? createRoot(rootElement);
window.__aiddeRoot.render(<App />);
