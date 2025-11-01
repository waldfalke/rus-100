# Ultra Think Mode: Multi-Agent Architecture Research

*Started: 2025-10-10*

## Цель исследования
Понять как РЕАЛЬНО работают multi-agent системы и Agent Creator для построения архитектуры в CDD методологии.

---

## Ключевые вопросы
1. Что такое "Agent Creator" - создаёт ли он код или только system prompts?
2. Agents - это разные процессы или разные промпты в одном процессе?
3. Как agents координируются - файлы, message queues, или что-то ещё?
4. Какие workflow паттерны используются в продакшене?

---

## Источники информации
- ✅ Anthropic: Building Effective Agents
- ✅ Microsoft AutoGen: Agent patterns
- ✅ Roo Code: Modes + Boomerang Tasks
- ✅ LangGraph: Multi-agent workflows
- ⏳ CrewAI: Sequential workflows
- ⏳ Workflow patterns глубже

---

## Находки (буду добавлять порциями)

### 🔥 BREAKTHROUGH: Roo Code Boomerang Pattern (строки 15070-15129)

**Критический инсайт:**
```yaml
Orchestrator Mode:
  - НЕ читает файлы
  - НЕ пишет код
  - Только использует new_task tool
  - Создаёт subtasks в ДРУГИХ modes
  
Subtask:
  - Отдельная isolated conversation
  - Свой mode (Code, Debug, etc)
  - Возвращает только summary
  - НЕ видит parent context
```

**Вывод:** Orchestrator создаёт НОВЫЕ СЕССИИ, не просто вызывает функции!

---

### 📊 Три архитектуры multi-agent систем (строки 15095-15129)

**1. AutoGen (Single Process):**
```python
await WorkerAgent.register(runtime, "my_agent", lambda: MyAgent())
# Agents в ОДНОМ runtime, разные промпты
# Message passing внутри процесса
```

**2. LangGraph (Graph Nodes):**
```python
builder.add_node("agent_1", agent_1_function)
# Agents = functions в graph
# State передаётся между nodes
```

**3. Roo Code (Isolated Sessions):**
```typescript
new_task(mode="code", message="Create Button.tsx")
// Создаёт НОВУЮ isolated conversation
// В другом mode (другой system prompt)
// Subtask = отдельная сессия!
```

---

### ✅ РЕАЛЬНАЯ картина Agent Creator (строки 14810-14880)

**Что Agent Creator РЕАЛЬНО делает (Roo Code):**
- Читает требования пользователя
- Генерирует system prompt (Markdown текст)
- Сохраняет как `.md` файл в registry
- Пользователь потом запускает mode вручную

**НЕ делает:**
- ❌ НЕ генерирует Python/TypeScript код агентов
- ❌ НЕ создаёт Docker образы
- ❌ НЕ запускает процессы автоматически

---

### 🎯 Три варианта для Claude Code (строки 14880-14980)

**Вариант 1: Roo Code подход (САМЫЙ РЕАЛЬНЫЙ)**
```
.agents/
├── registry/
│   ├── contract-steward.md      ← System prompt
│   ├── code-artisan.md
│   └── test-sentinel.md
└── agent-consultant.md          ← Agent Creator
```

**Вариант 2: AutoGen-style (Python wrapper)**
```python
class CascadeAgentRegistry:
    @classmethod
    def register(cls, name: str, system_prompt_path: str)
    
    @classmethod
    def spawn(cls, name: str) -> subprocess.Popen:
        # Запускает Cascade с --system-prompt-file
```

**Вариант 3: File-based (МИНИМАЛИСТИЧНЫЙ)**
```json
// .agents/registry.json
{
  "contract-steward": {
    "system_prompt": ".agents/registry/contract-steward.md",
    "tools": ["read_file", "write_file"],
    "context_files": ["METACONTRACT.yml"]
  }
}
```

---

### ❌ Perplexity вымышленный код (строки 14790-14810)

**Что ВЫМЫШЛЕННОЕ:**
```python
from crewai import ClaudeAgent, GPTAgent  # ❌ НЕТ в CrewAI
image: crewai/claude-agent  # ❌ НЕТ такого образа
class PromptRegistry  # ❌ НЕТ в фреймворках
```

**Реальный CrewAI:**
```python
from crewai import Agent, Task, Crew

researcher = Agent(
    role='Researcher',
    goal='Research and analyze',
    llm='claude-3-5-sonnet'  # ← Строка, не класс!
)
```

---

### 📚 Anthropic паттерны (строки 13670-13710)

**Официальные workflow patterns:**
1. **Prompt chaining** - последовательные вызовы
2. **Routing** - условная маршрутизация
3. **Parallelization** - параллельное выполнение
4. **Orchestrator-workers** ← главный для multi-agent
5. **Evaluator-optimizer** - оценка и улучшение

**Критичные факты:**
- Multi-agent = **15× больше токенов** чем chat
- Token usage объясняет 80% variance в performance
- Отлично для breadth-first queries
- ❌ НЕ подходит когда нужен shared context

**Важно:** Anthropic НЕ использует термин "Agent Creator"!

---

### 🦾 Roo Code Agent Consultant Mode (строки 13780-13800)

**Это их версия Agent Creator:**
```yaml
Workflow:
1. Retrieve Roo docs via MCP (Context7 server)
2. Retrieve prompt engineering best practices
3. Reference docs in analysis
4. Create new custom modes / rules files

Purpose: "помогать создавать другие modes и rules"
```

**Ключевое:**
- Использует MCP для актуальной документации
- Создаёт system prompts для новых modes
- Пишет mode-specific instructions
- Помогает с rules файлами

---

### 🏭 Microsoft "Agent Factory" (строки 13980-14090)

**5 паттернов от Microsoft Azure:**
1. **Tool Use** - agents call APIs/tools
2. **Reflection** - self-improvement loops
3. **Planning** - decompose tasks
4. **Multi-Agent** - orchestrator + workers
5. **ReAct** - Reason + Act in loops

**AutoGen "Mixture of Agents" (MoA):**
```python
# Orchestrator РЕГИСТРИРУЕТ worker types:
await WorkerAgent.register(
    runtime,
    "Product_Manager_Agent",
    lambda: WorkerAgent(
        model_client=...,
        agent_id="Product_Manager_Agent",
        prompt=PRODUCT_MANAGER_PROMPT  # ← System prompt!
    )
)

# Orchestrator СОЗДАЁТ instances:
worker_ids = [
    AgentId(worker_type, f"{self.id.key}/layer_{i}/worker_{j}")
    for j, worker_type in enumerate(self._worker_agent_types)
]

# Orchestrator ВЫЗЫВАЕТ:
results = await asyncio.gather(
    *[self.send_message(worker_task, worker_id) for worker_id in worker_ids]
)
```

**Ключевой инсайт:**
- Orchestrator **не генерирует код** агентов
- Orchestrator **регистрирует типы** с разными system prompts
- Orchestrator **создаёт instances** и **вызывает** их

---

### 📝 File-based Communication для Cascade (строки 14100-14310)

**Architecture:**
```
.agents/
├── registry/
│   ├── contract-steward.md      ← System prompt
│   ├── code-artisan.md
│   └── orchestrator.md
│
├── tasks/                        ← Shared task queue
│   ├── task-001.json
│   └── task-002.json
│
└── results/                      ← Agent outputs
    ├── contracts/
    └── components/
```

**Task format:**
```json
{
  "id": "task-001",
  "agent": "contract-steward",
  "status": "completed",
  "input": {
    "component": "Button",
    "requirements": "Primary/secondary variants"
  },
  "output": {
    "file": "results/contracts/CONTRACT-BUTTON-001.yml",
    "completed_at": "2025-01-10T16:15:00Z"
  },
  "dependencies": []
}
```

**Преимущества:**
1. **Параллелизм** - несколько Cascade процессов одновременно
2. **Специализация** - каждый агент с минимальным контекстом
3. **Fault Isolation** - сбой одного не ломает остальных

---

## 🔄 Workflow паттерны (новое чтение)

### 🎯 LangGraph: Handoff Tools Pattern

**Как supervisor передаёт работу:**
```python
def create_handoff_tool(agent_name: str):
    @tool(f"transfer_to_{agent_name}")
    def handoff_tool(state, tool_call_id):
        return Command(
            goto=agent_name,              # ← Куда передать
            update={...state},            # ← Что передать
            graph=Command.PARENT          # ← В parent graph
        )
```

**Supervisor agent:**
```python
supervisor_agent = create_react_agent(
    tools=[assign_to_research, assign_to_math],
    prompt="You are supervisor managing agents. 
            Assign work to ONE agent at a time. 
            Do NOT do work yourself."
)
```

**Ключевые инсайты:**
- Supervisor **НЕ делает работу** сам - только делегирует
- Handoff = tool call который переключает control
- State передаётся через graph nodes
- "Do not call agents in parallel" - sequential!

---

### 📮 AutoGen: Pub/Sub Topics Pattern

**Как agents общаются:**
```python
@type_subscription(topic_type="concept_extractor")
class ConceptExtractorAgent(RoutedAgent):
    @message_handler
    async def handle_user_description(self, message, ctx):
        # Обрабатывает входящее
        result = await llm.create(...)
        
        # Публикует в следующий топик
        await self.publish_message(
            Message(result),
            topic_id=TopicId("writer_topic", source=self.id.key)
        )
```

**Регистрация агентов:**
```python
await ConceptExtractorAgent.register(
    runtime,
    type="concept_extractor_topic",
    factory=lambda: ConceptExtractorAgent(model_client)
)
```

**Запуск workflow:**
```python
await runtime.publish_message(
    Message("Product: eco-friendly bottle..."),
    topic_id=TopicId("concept_extractor", source="default")
)
await runtime.stop_when_idle()
```

**Ключевые инсайты:**
- Agents = subscribers к topics
- Sequential flow = каждый публикует в топик следующего
- Все в ОДНОМ runtime (SingleThreadedAgentRuntime)
- Factory pattern для создания instances

---

### 🏭 Perplexity: Agent Factory + Template Registry (строки 14312-14449)

**Perplexity показала ВЫМЫШЛЕННЫЙ но концептуально правильный пример:**

```python
class AgentFactory:
    _registry: Dict[str, Type[Agent]] = {}
    
    @classmethod
    def register(cls, name: str, agent_cls: Type[Agent]):
        cls._registry[name] = agent_cls
    
    @classmethod
    def create(cls, name: str, **kwargs) -> Agent:
        return cls._registry[name](**kwargs)

# Meta-Agent orchestrates
class MetaAgent:
    def orchestrate(self):
        ingest_agent = self.factory.create("ingest")
        train_agent = self.factory.create("train")
```

**Template Registry pattern:**
```python
@dataclass
class AgentTemplate:
    cls: Callable[..., Agent]
    default_params: Dict[str, Any]

TemplateRegistry.add_template(
    "ingest",
    AgentTemplate(DataIngestionAgent, default_params={...})
)
```

**Важно:**
- ❌ Код ВЫМЫШЛЕННЫЙ (нет в реальных фреймворках)
- ✅ Концепция правильная (registry + factory)
- ✅ Meta-agent spawns workers динамически

---

### 📁 File-based Architecture для Cascade (строки 14100-14310)

**Предложенная архитектура:**
```
.agents/
├── registry/
│   ├── contract-steward.md      ← System prompt
│   ├── code-artisan.md
│   └── orchestrator.md
│
├── tasks/                        ← Shared task queue
│   ├── task-001.json
│   └── task-002.json
│
└── results/                      ← Agent outputs
    ├── contracts/
    └── components/
```

**Task format:**
```json
{
  "id": "task-001",
  "agent": "contract-steward",
  "status": "completed",
  "dependencies": ["task-000"],
  "output": {
    "file": "results/contracts/CONTRACT-BUTTON-001.yml"
  }
}
```

**Как запускаются:**
```bash
# Terminal 1: Orchestrator Agent
cascade --mode orchestrator
# Создаёт подзадачи в tasks/

# Terminal 2: Contract Steward Agent  
cascade --mode contract-steward
# Слушает tasks/ → выполняет → пишет в results/

# Terminal 3: Code Artisan Agent
cascade --mode code-artisan
# Ждёт dependencies → генерирует код
```

**Преимущества:**
1. **Параллелизм** - несколько процессов одновременно
2. **Специализация** - каждый агент ~100KB context вместо 500KB
3. **Fault Isolation** - сбой одного не ломает остальных

---

### 🎯 Agent Creator для Cascade (строки 14179-14298)

**Agent Creator = Claude сессия которая ПИШЕТ system prompts**

**Пример сгенерированного промпта:**
```markdown
# .agents/registry/contract-steward.md

You are Contract Steward, specializing in YAML contracts.

## Your Role
Create component contracts following METACONTRACT rules.

## Your Workflow
1. Read task from .agents/tasks/{task-id}.json
2. Load METACONTRACT.yml and templates
3. Generate CONTRACT-{NAME}-001.yml
4. Write to .agents/results/contracts/
5. Update task status to "completed"

## Your Constraints
- MUST follow METACONTRACT schema
- NO code generation (only YAML contracts)

## Your Tools
- read_file, write_file, validate

## Success Criteria
- Contract passes schema validation
- All required fields present
```

**Вывод:**
- Agent Creator создаёт `.md` файлы с system prompts
- Каждый агент = отдельная Cascade сессия
- Communication через файловую систему
- Agents работают НЕЗАВИСИМО

---

### ⚠️ КРИТИЧНО: Perplexity вымышленный код (строки 14622-14949)

**Perplexity дала второй ответ - тоже вымышленный!**

**❌ Что ВЫМЫШЛЕННОЕ:**
```python
from crewai import ClaudeAgent, GPTAgent  # ❌ НЕТ в CrewAI
image: crewai/claude-agent  # ❌ НЕТ такого образа
class PromptRegistry  # ❌ НЕТ в фреймворках
```

**✅ РЕАЛЬНЫЙ CrewAI:**
```python
from crewai import Agent, Task, Crew

researcher = Agent(
    role='Researcher',
    goal='Research and analyze',
    backstory='Expert at finding information',
    llm='claude-3-5-sonnet'  # ← Строка, не класс!
)

# НЕТ никакой "фабрики" - просто создаёшь инстансы
```

**✅ РЕАЛЬНЫЙ AutoGen:**
```python
await WorkerAgent.register(
    runtime,
    "Product_Manager_Agent",
    lambda: WorkerAgent(
        model_client=OpenAIChatCompletionClient(...),
        agent_id="Product_Manager_Agent",
        prompt="You are product manager..."  # ← System prompt
    )
)

# Registry = словарь в runtime
# НЕТ отдельного PromptRegistry класса
```

**✅ РЕАЛЬНЫЙ Roo Code:**
```yaml
# .roo/modes/contract-steward.md
Mode Definition:
You are Contract Steward, expert in YAML contracts...

# Modes = файлы с system prompts, НЕТ Python классов!
```

**ВЫВОД:**
- Perplexity **придумывает** код, комбинируя концепты
- Нужно проверять ВСЁ по реальной документации
- Generic programming patterns ≠ LLM-specific реализация

---

### 🎯 Три реальных варианта для Cascade (строки 14880-14949)

**Вариант 1: Roo Code подход (САМЫЙ РЕАЛЬНЫЙ)**
```
.agents/
├── registry/
│   ├── contract-steward.md      ← System prompt
│   ├── code-artisan.md
│   └── test-sentinel.md
└── agent-consultant.md          ← Agent Creator
```

**Agent Creator workflow:**
1. Читает требования пользователя
2. Генерирует новый `.md` файл с system prompt  
3. Сохраняет в `registry/`
4. Пользователь запускает: `cascade --mode contract-steward`

**Вариант 2: AutoGen-style (Python wrapper)**
```python
class CascadeAgentRegistry:
    @classmethod
    def register(cls, name: str, system_prompt_path: str)
    
    @classmethod
    def spawn(cls, name: str) -> subprocess.Popen:
        # Запускает: cascade --system-prompt-file
```

**Вариант 3: File-based (МИНИМАЛИСТИЧНЫЙ)**
```json
// .agents/registry.json
{
  "contract-steward": {
    "system_prompt": ".agents/registry/contract-steward.md",
    "tools": ["read_file", "write_file"],
    "context_files": ["METACONTRACT.yml"]
  }
}
```

**ВЫВОД:**
- Вариант 1 (Roo Code) - самый простой и реальный
- НЕ нужны Docker/Redis/RabbitMQ
- Communication = файлы в shared директории
- Каждый агент = отдельный Cascade процесс

---

### 🔍 Противоречия в паттернах (строки 15005-15023)

**Anthropic:**
- "Agents = autonomous loops"
- Multi-agent = Lead + Subagents в parallel
- 15× больше токенов чем single agent

**AutoGen:**
- Registry pattern с `WorkerAgent.register()`
- Agents в ОДНОМ runtime
- Message passing через `send_message()`

**Roo Code:**
- Modes = system prompts
- Agent Consultant создаёт modes
- User запускает вручную

**Ключевой вопрос:**
- Agents в AutoGen - это РАЗНЫЕ процессы или РАЗНЫЕ промпты в одном процессе?

**Ответ (из строк 15095-15129):**
- AutoGen = agents в ОДНОМ runtime (single process)
- LangGraph = agents = functions в graph
- Roo Code = agents = ISOLATED SESSIONS (разные процессы)

---

### 🎯 Синтез архитектур (строки 14957-14991)

**Основа на РЕАЛЬНЫХ паттернах для CONTRACT:**

1. **System Prompt Registry** (Roo Code реальность)
   - `.agents/registry/*.md` файлы
   - Каждый = system prompt для агента

2. **Agent Creator** (Roo Code "Agent Consultant")
   - Meta-agent который ПИШЕТ `.md` файлы
   - Не Python классы, а Markdown документы

3. **File-based Communication** (Cascade реальность)
   - `.agents/tasks/*.json` для задач
   - `.agents/results/` для outputs
   - NO Redis, NO RabbitMQ

4. **Orchestrator** (Microsoft/Anthropic паттерн)
   - Мониторит task queue
   - Spawns Cascade processes
   - Собирает results

**Что НЕ включать в CONTRACT:**
- ❌ Вымышленные `ClaudeAgent` классы
- ❌ Несуществующие Docker образы
- ❌ Redis/RabbitMQ для communication

---

## 📝 Выводы и следующие шаги

### Что установлено точно:

1. **Agent = System Prompt + Session**
   - В Roo Code: mode definition file
   - В AutoGen: system prompt в lambda
   - В Cascade: `.md` file с промптом

2. **Agent Creator = Prompt Generator**
   - Создаёт `.md` файлы с system prompts
   - НЕ генерирует Python/TS код
   - НЕ создаёт runtime processes

3. **Multi-Agent координация:**
   - AutoGen: в одном runtime (pub/sub topics)
   - LangGraph: через graph state
   - Roo Code: isolated sessions (new_task tool)
   - Cascade: file-based (tasks/ + results/)

4. **Orchestrator паттерн:**
   - НЕ делает работу сам
   - Только координирует workers
   - Sequential или parallel execution

### Что нужно уточнить:

- ⏳ Roo Code `new_task` - как технически создаёт subtask?
- ⏳ Cascade multi-session - возможно ли программно?
- ✅ Workflow patterns для sequential/parallel координации - ИССЛЕДОВАНО
- 🔥 **Git/FileSystem isolation** - каждый агент в своем форке? КРИТИЧНО!

---

## 🔥 КРИТИЧНЫЙ ВОПРОС: Git/FileSystem Isolation

### Проблема:
**Что если два агента одновременно редактируют один файл?**
- Contract Steward пишет CONTRACT-BUTTON.yml
- Code Artisan читает этот же файл
- Orchestrator мониторит .agents/tasks/

**Варианты:**

### Вариант 1: Shared Workspace (все в одной папке)
```
Преимущества:
+ Простота - один git repo
+ Agents видят изменения друг друга сразу
+ Нет merge conflicts между агентами

Риски:
- Race conditions при записи
- Git conflicts если параллельно
- Сложно откатить изменения одного агента
```

### Вариант 2: Git Forks (каждый агент = форк)
```
Преимущества:
+ Полная изоляция
+ Каждый агент на своей ветке
+ Легко откатить
+ Code review между агентами

Риски:
- Сложность merge
- Дублирование на диске
- Sync между форками
```

### Вариант 3: Git Worktrees (один repo, разные working dirs)
```
git worktree add ../agent-contract-steward main
git worktree add ../agent-code-artisan main

Преимущества:
+ Один .git, разные рабочие папки
+ Изоляция файловой системы
+ Нет дублирования истории
+ Agents на разных ветках

Риски:
- Нужен merge workflow
- Не все знают про worktrees
```

### Вариант 4: Hybrid (shared read, isolated write)
```
Agents читают из main workspace:
  .agents/tasks/      ← shared read
  .agents/results/    ← каждый в своей папке

Каждый пишет в свою зону:
  .agents/results/contract-steward/
  .agents/results/code-artisan/

Orchestrator собирает из всех зон

Преимущества:
+ Нет conflicts
+ Простой coordination
+ Можно в одном git repo

Риски:
- Нужна convention о зонах ответственности
```

---

### 🎯 Что исследовать СРОЧНО:
- Как LangGraph/AutoGen/CrewAI решают file conflicts?
- Production examples multi-agent + git workflow
- Best practices для parallel file modifications

---

## 🔄 Workflow Patterns (новое чтение)

### 🎯 LangGraph: Handoff Tools Pattern

**Как supervisor передаёт работу:**
```python
def create_handoff_tool(agent_name: str):
    @tool(f"transfer_to_{agent_name}")
    def handoff_tool(state, tool_call_id):
        return Command(
            goto=agent_name,              # ← Куда передать
            update={...state},            # ← Что передать
            graph=Command.PARENT          # ← В parent graph
        )
```

**Supervisor agent:**
```python
supervisor_agent = create_react_agent(
    tools=[assign_to_research, assign_to_math],
    prompt="You are supervisor managing agents. 
            Assign work to ONE agent at a time. 
            Do NOT do work yourself."
)
```

**Ключевые инсайты:**
- Supervisor **НЕ делает работу** сам - только делегирует
- Handoff = tool call который переключает control
- State передаётся через graph nodes
- "Do not call agents in parallel" - sequential!

---

### 📮 AutoGen: Pub/Sub Topics Pattern

**Как agents общаются:**
```python
@type_subscription(topic_type="concept_extractor")
class ConceptExtractorAgent(RoutedAgent):
    @message_handler
    async def handle_user_description(self, message, ctx):
        # Обрабатывает входящее
        result = await llm.create(...)
        
        # Публикует в следующий топик
        await self.publish_message(
            Message(result),
            topic_id=TopicId("writer_topic", source=self.id.key)
        )
```

**Регистрация агентов:**
```python
await ConceptExtractorAgent.register(
    runtime,
    type="concept_extractor_topic",
    factory=lambda: ConceptExtractorAgent(model_client)
)
```

**Запуск workflow:**
```python
await runtime.publish_message(
    Message("Product: eco-friendly bottle..."),
    topic_id=TopicId("concept_extractor", source="default")
)
await runtime.stop_when_idle()
```

**Ключевые инсайты:**
- Agents = subscribers к topics
- Sequential flow = каждый публикует в топик следующего
- Все в ОДНОМ runtime (SingleThreadedAgentRuntime)
- Factory pattern для создания instances

---

### 🎭 CrewAI: Sequential/Parallel Task Hand-offs

**Архитектура:**
```
CrewAI's "Crews and Flows" pattern:
- Crew assigns role-based responsibilities
- Tasks execute sequentially OR in parallel
- Structured task hand-offs (not free-form messaging)
- Crew controller orchestrates deterministic pipeline
```

**Ключевые особенности:**
- Communication: structured task hand-offs
- Execution model: sequential/parallel
- State management: straightforward, tracks task progress
- Memory: agents retain context within workflow
- Pipeline: linear, procedure-driven (like scripted play)
- Output: structured (JSON/Pydantic) with schema enforcement

**Отличие от AutoGen:**
- CrewAI: structured task hand-offs
- AutoGen: free-form chat-based message passing

---

### ⚡ OpenAI Swarm: Lightweight Implicit Handoffs

**Минималистичный подход:**
```
Components:
- Agent class (system prompt + functions)
- Swarm client (manages execution)

Control flow:
- No central controller
- Implicit control via agent hand-offs
- Function calls trigger transitions
```

**Ключевые особенности:**
- Communication: shared conversation logs
- State: stateless (manual persistence required)
- Memory: relies on messages list
- Handoffs: implicit via function calls
- Architecture: simple, minimal framework overhead

---

### 📊 Сравнение Workflow Patterns

| Framework | Orchestration | Communication | State Management |
|-----------|--------------|---------------|------------------|
| **LangGraph** | Graph-based (DAG) | Shared graph state | Persistent storage, error recovery |
| **AutoGen** | Pub/Sub topics | Message passing | Single runtime, topic-based |
| **CrewAI** | Crew controller | Structured hand-offs | Task progress tracking |
| **Swarm** | Implicit handoffs | Conversation logs | Stateless (manual) |

**LangGraph:**
- State machine approach
- Explicit control flow (nodes + edges)
- Supervisor directs execution based on state
- Supports branching, looping, parallelism

**AutoGen:**
- Sequential pipeline through topics
- Each agent subscribes to specific topic
- Publishes to next agent's topic
- All in one runtime process

**CrewAI:**
- Deterministic pipeline
- Structured, cumulative knowledge
- Sequential or parallel task execution
- Like scripted play with defined roles

**Swarm:**
- Lightweight, flexible
- Manual logic handling
- Minimal abstractions
- High customizability

---

### 🏗️ Hierarchical Multi-Agent (LangGraph)

**Для масштабирования supervisor pattern:**

```python
# Team 1 with supervisor
team_1_graph = create_team_with_supervisor([
    team_1_agent_1,
    team_1_agent_2
])

# Team 2 with supervisor
team_2_graph = create_team_with_supervisor([
    team_2_agent_1,
    team_2_agent_2
])

# Top-level supervisor manages teams
top_level_supervisor = create_supervisor([
    ("team_1_graph", team_1_graph),
    ("team_2_graph", team_2_graph)
])
```

**Когда нужно:**
- Слишком много агентов для одного supervisor
- Supervisor делает плохие решения
- Контекст слишком сложный
- Нужна специализация команд

**Решение:**
- Separate specialized teams
- Individual team supervisors
- Top-level supervisor для координации

---

## 🎯 Синтез: Применимость к Cascade/Claude Code

### ❌ Что НЕ подходит для Cascade:

**LangGraph подход:**
- ❌ Graph-based state machine - требует framework
- ❌ Shared graph state - нужен runtime
- ❌ Command objects - специфично для LangGraph

**AutoGen подход:**
- ❌ Pub/Sub topics - требует message broker
- ❌ SingleThreadedAgentRuntime - нужен Python runtime
- ❌ @type_subscription decorators - framework-specific

**CrewAI подход:**
- ❌ Crew controller - централизованный оркестратор
- ❌ Structured output schemas - требует framework

**Swarm подход:**
- ⚠️ Lightweight approach - интересно, но stateless

---

### ✅ Что ПОДХОДИТ для Cascade:

**От Roo Code (самый близкий):**
```
✅ Modes = system prompt files (.md)
✅ new_task tool = создание isolated sessions
✅ File-based communication
✅ Agent Consultant = meta-agent для создания modes
```

**От LangGraph concepts:**
```
✅ Supervisor НЕ делает работу - только координирует
✅ Handoff pattern - передача control между agents
✅ Hierarchical teams - для масштабирования
```

**От AutoGen concepts:**
```
✅ Factory pattern - registry of agent types
✅ Sequential workflow - pipeline через файлы
✅ Worker registration - регистрация типов агентов
```

**От CrewAI concepts:**
```
✅ Sequential/Parallel execution
✅ Task progress tracking
```

---

## 🔄 LangGraph Workflow Patterns (глубокий анализ)

### 🎯 Pattern 1: Handoffs (передача control)

**Как работает:**
```python
def agent(state) -> Command[Literal["agent", "another_agent"]]:
    goto = get_next_agent(...)  # Решает куда передать
    return Command(
        goto=goto,                           # ← Куда
        update={"my_state_key": "value"}     # ← Что передать
    )
```

**Ключевые инсайты:**
- Agent возвращает `Command` object с `goto` (destination) и `update` (payload)
- Условие routing может быть любым (LLM tool call, structured output, etc)
- Agents сами решают к кому передать control (не центральный coordinator)

**Для subgraphs (вложенные агенты):**
```python
def some_node_inside_alice(state):
    return Command(
        goto="bob",                    # ← Agent в parent graph
        update={"key": "value"},
        graph=Command.PARENT          # ← Важно! Навигация в parent
    )
```

**Handoffs as tools (для tool-calling agents):**
```python
@tool
def transfer_to_bob():
    """Transfer to bob."""
    return Command(
        goto="bob",
        update={"my_state_key": "value"},
        graph=Command.PARENT          # ← Навигация в parent graph
    )
```

**Вывод для Cascade:**
- File-based analog: agent пишет `{"next_agent": "bob", "payload": {...}}` в task file
- НЕ нужен centralized router - agents сами решают

---

### 🎯 Pattern 2: Supervisor (центральный координатор)

**Архитектура:**
```python
def supervisor(state) -> Command[Literal["agent_1", "agent_2", END]]:
    response = model.invoke(...)  # ← LLM решает
    return Command(goto=response["next_agent"])

def agent_1(state) -> Command[Literal["supervisor"]]:
    response = model.invoke(...)
    return Command(
        goto="supervisor",           # ← Возвращает control supervisor-у
        update={"messages": [response]}
    )
```

**Критично:**
- Supervisor = LLM который принимает решения
- Agents ВСЕГДА возвращают control supervisor-у
- Supervisor может вернуть `END` чтобы завершить execution
- Map-reduce pattern: supervisor запускает agents в parallel

**Вывод для Cascade:**
- Orchestrator читает task results → решает кого вызвать следующим
- Workers пишут results → Orchestrator анализирует → создаёт новые tasks

---

### 🎯 Pattern 3: Supervisor (tool-calling variant)

**Архитектура:**
```python
def agent_1(state: Annotated[dict, InjectedState]):
    response = model.invoke(...)
    return response.content  # ← Возвращает string (tool response)

tools = [agent_1, agent_2]

# Supervisor = prebuilt ReAct agent
supervisor = create_react_agent(model, tools)
```

**Ключевые отличия:**
- Sub-agents = **tools** для supervisor
- Supervisor = standard ReAct agent (LLM в loop с tool calls)
- Agents возвращают string (tool response format)
- Prebuilt `create_react_agent` автоматически делает ToolMessage

**Вывод:**
- Это ближе к "function calling" чем к "independent agents"
- Agents НЕ автономны - это просто functions которые supervisor вызывает
- Для Cascade: НЕ подходит - нам нужны independent agents

---

## 🔄 AutoGen Sequential Workflow (глубокий анализ)

### 🎯 Архитектура Sequential Pipeline

**Workflow пример:**
```
User → ConceptExtractor → Writer → FormatProof → User
```

**Как работает:**
```python
@type_subscription(topic_type="ConceptExtractorAgent")
class ConceptExtractorAgent(RoutedAgent):
    @message_handler
    async def handle_user_description(self, message: Message, ctx):
        # 1. Обрабатывает входящее сообщение
        response = await self._model_client.create(...)
        
        # 2. Публикует результат в топик следующего агента
        await self.publish_message(
            Message(response),
            topic_id=TopicId("WriterAgent", source=self.id.key)
        )
```

**Регистрация агентов:**
```python
runtime = SingleThreadedAgentRuntime()  # ← ОДИН runtime!

await ConceptExtractorAgent.register(
    runtime,
    type="ConceptExtractorAgent",
    factory=lambda: ConceptExtractorAgent(model_client)
)

await WriterAgent.register(
    runtime,
    type="WriterAgent",
    factory=lambda: WriterAgent(model_client)
)
```

**Запуск workflow:**
```python
runtime.start()

await runtime.publish_message(
    Message("Product description..."),
    topic_id=TopicId("ConceptExtractorAgent", source="default")
)

await runtime.stop_when_idle()  # ← Ждёт пока все агенты закончат
```

**КРИТИЧНЫЕ инсайты:**

1. **Все агенты в ОДНОМ runtime** (SingleThreadedAgentRuntime)
   - НЕ разные процессы
   - НЕ разные сессии
   - Просто разные классы с разными промптами

2. **Pub/Sub через topics**
   - Каждый агент = subscriber к своему topic
   - Sequential flow = A публикует в topic B, B в topic C
   - Message passing ВНУТРИ процесса

3. **Factory pattern**
   - `factory=lambda: Agent()` создаёт instances
   - Registry хранит типы агентов
   - Runtime управляет жизненным циклом

4. **Deterministic sequence**
   - Каждый агент знает куда публиковать результат
   - Hardcoded в коде агента: `TopicId("WriterAgent", ...)`
   - Sequential = linear pipeline

**Вывод для Cascade:**
- AutoGen = ОДИН процесс, разные промпты
- Cascade нужно = РАЗНЫЕ процессы/сессии
- НО паттерн pub/sub через файлы можно адаптировать:
  - `.agents/topics/ConceptExtractor/*.json` ← сообщения для агента
  - Agent читает свой topic → обрабатывает → публикует в topic следующего

---

## 📊 Сравнение всех изученных паттернов

| Framework | Architecture | Communication | Process Type |
|-----------|-------------|---------------|--------------|
| **LangGraph** | Handoffs via Command | Shared graph state | Same process (graph nodes) |
| **LangGraph** | Supervisor | Command.goto | Same process (graph nodes) |
| **AutoGen** | Sequential pub/sub | Topics + messages | Same runtime (SingleThreaded) |
| **Roo Code** | Boomerang Tasks | new_task tool | **Isolated sessions!** |

**КРИТИЧНЫЙ вывод:**
- Почти все фреймворки = agents в ОДНОМ процессе
- Только Roo Code = isolated sessions (разные процессы/сессии)
- Cascade должен следовать Roo Code подходу

---

## 🎯 Итоговая архитектура для Cascade (синтез всех паттернов)

### 1. Agent Registry (от Roo Code + AutoGen)
```
.agents/
├── registry/
│   ├── contract-steward.md      # System prompt
│   ├── code-artisan.md
│   ├── test-sentinel.md
│   └── orchestrator.md
│
└── registry.json                 # Metadata
    {
      "contract-steward": {
        "system_prompt": "registry/contract-steward.md",
        "tools": ["read_file", "write_file"],
        "context_files": ["METACONTRACT.yml"]
      }
    }
```

**2. Task Queue (от CrewAI + file-based):**
```
.agents/
├── tasks/
│   ├── task-001.json            # Pending task
│   └── task-002.json            # Waiting on dependencies
│
└── results/
    ├── task-001-result.json     # Completed task
    └── contracts/               # Actual outputs
        └── CONTRACT-BUTTON.yml
```

**Task format (от AutoGen topics + CrewAI structure):**
```json
{
  "id": "task-001",
  "agent_type": "contract-steward",
  "status": "pending",
  "input": {
    "component": "Button",
    "requirements": "Primary/secondary variants"
  },
  "dependencies": [],
  "output": null,
  "created_at": "2025-10-10T20:00:00Z"
}
```

**3. Orchestrator (от LangGraph Supervisor):**
```markdown
# .agents/registry/orchestrator.md

You are Orchestrator Agent - you coordinate other agents.

## Your Role
- Break down user requests into tasks
- Assign tasks to specialized agents
- Monitor task completion
- Aggregate results

## Your Workflow
1. Read user request
2. Decompose into subtasks
3. Create task files in .agents/tasks/
4. Monitor .agents/results/ for completions
5. Aggregate and report to user

## Your Constraints
- DO NOT write code yourself
- DO NOT create contracts yourself
- ONLY coordinate other agents
- Sequential execution (one task at a time)

## Your Tools
- read_file: Check task status
- write_file: Create task files
- list_dir: Monitor results directory
```

**4. Worker Agents (от всех фреймворков):**
```markdown
# .agents/registry/contract-steward.md

You are Contract Steward - specialized in YAML contracts.

## Your Workflow (от CrewAI sequential)
1. Poll .agents/tasks/ for your agent_type
2. Read task-XXX.json where agent_type="contract-steward"
3. Load context files from registry.json
4. Generate CONTRACT-{NAME}.yml
5. Write to .agents/results/contracts/
6. Update task status to "completed"
7. Go back to step 1

## Your Context (от AutoGen specialization)
- METACONTRACT.yml (schema rules)
- CONTRACT templates (examples)
- Component requirements (from task input)

## Your Output (от CrewAI structured)
- YAML file following METACONTRACT schema
- Task result JSON with file path
```

**5. Agent Creator (от Roo Code Agent Consultant):**
```markdown
# .agents/registry/agent-creator.md

You are Agent Creator - you design new agents.

## Your Role
Create new specialized agents by writing system prompts.

## Your Workflow
1. Read user requirements for new agent
2. Determine agent specialization
3. Design system prompt structure:
   - Role definition
   - Workflow steps
   - Constraints
   - Tools needed
   - Context files
   - Success criteria
4. Write .md file to .agents/registry/
5. Update registry.json with metadata

## Your Output Format
A complete system prompt in markdown following template:
- # System Prompt: {Agent Name}
- ## Your Role
- ## Your Workflow
- ## Your Constraints
- ## Your Tools
- ## Your Context
- ## Success Criteria
```

---

### 🚀 Execution Model для Cascade

**Вариант 1: Manual (MVP)**
```bash
# Terminal 1: Orchestrator
cascade chat --system-prompt-file=.agents/registry/orchestrator.md

# Terminal 2: Contract Steward (polling loop)
while true; do
  cascade chat --system-prompt-file=.agents/registry/contract-steward.md
  sleep 5
done

# Terminal 3: Code Artisan (polling loop)
while true; do
  cascade chat --system-prompt-file=.agents/registry/code-artisan.md
  sleep 5
done
```

**Вариант 2: Python Wrapper (advanced)**
```python
import subprocess
import json
import time
from pathlib import Path

class CascadeAgentOrchestrator:
    def __init__(self):
        self.registry = self.load_registry()
        self.running_agents = {}
    
    def spawn_agent(self, agent_type: str):
        """Spawn Cascade process with agent's system prompt"""
        config = self.registry[agent_type]
        process = subprocess.Popen([
            "cascade", "chat",
            "--system-prompt-file", config["system_prompt"],
            "--auto-approve"  # If available
        ])
        self.running_agents[agent_type] = process
    
    def monitor_tasks(self):
        """Monitor task queue and spawn agents as needed"""
        while True:
            tasks = self.get_pending_tasks()
            for task in tasks:
                agent_type = task["agent_type"]
                if agent_type not in self.running_agents:
                    self.spawn_agent(agent_type)
            time.sleep(5)
```

**Вариант 3: CLI Tool (simplest)**
```bash
# .agents/orchestrate.sh
#!/bin/bash

# Start orchestrator
cascade chat --system-prompt-file=.agents/registry/orchestrator.md \
  --message="Analyze user request and create tasks"

# Wait for tasks to be created
sleep 2

# Process each pending task
for task in .agents/tasks/*.json; do
  agent_type=$(jq -r '.agent_type' $task)
  cascade chat --system-prompt-file=.agents/registry/$agent_type.md \
    --message="Process task: $task"
done
```

---

## 📝 Финальные выводы для CONTRACT

### Что включить в CONTRACT-MULTI-AGENT-ORCHESTRATION.yml:

**1. Agent Registry Pattern:**
- System prompt files (.md) в .agents/registry/
- Metadata в registry.json
- Factory pattern для создания agents

**2. File-based Communication:**
- Task queue в .agents/tasks/
- Results в .agents/results/
- JSON format для tasks и results

**3. Orchestrator Pattern:**
- Supervisor НЕ делает работу сам
- Только координирует workers
- Sequential execution (MVP)
- Parallel execution (future)

**4. Worker Agents:**
- Polling loop для task queue
- Specialized context (minimal)
- Structured output
- Status updates

**5. Agent Creator:**
- Meta-agent для создания system prompts
- Template-based generation
- Registry updates

### Что НЕ включать:

- ❌ Framework-specific code (LangGraph, AutoGen, CrewAI)
- ❌ Python runtime requirements
- ❌ Message brokers (Redis, RabbitMQ)
- ❌ Complex state machines
- ❌ Вымышленные API

### Референсы (проверенные):

- ✅ Anthropic: Orchestrator-Workers pattern
- ✅ Microsoft AutoGen: Sequential Workflow, Factory pattern
- ✅ LangGraph: Supervisor pattern, Handoffs
- ✅ Roo Code: Modes as system prompts, Boomerang tasks
- ✅ OpenAI Swarm: Lightweight handoffs

---

## ✅ RESEARCH ЗАВЕРШЁН

**Дата:** 2025-10-10  
**Время:** 20:50  
**Статус:** Все ключевые вопросы исследованы

### Главные находки:

1. **"Agent Creator" = System Prompt Generator**
   - НЕ генерирует код агентов
   - Генерирует .md файлы с system prompts
   - Примеры: Roo Code "Agent Consultant Mode"

2. **Multi-Agent Architecture:**
   - **Большинство фреймворков:** Agents в ОДНОМ процессе (разные промпты)
   - **Roo Code (уникально):** Isolated sessions (разные процессы)
   - **Cascade:** Должен следовать Roo Code подходу

3. **Coordination Patterns:**
   - **LangGraph:** Handoffs via Command, Supervisor с tools
   - **AutoGen:** Pub/Sub topics, Sequential workflow
   - **Roo Code:** Boomerang tasks (new_task tool)
   - **Для Cascade:** File-based task queue

4. **Orchestrator Role:**
   - НЕ делает работу сам - только координирует
   - Читает results → создаёт новые tasks
   - LLM принимает решения о delegation

5. **File-based Architecture (проверено):**
   - `.agents/registry/*.md` - system prompts
   - `.agents/tasks/*.json` - task queue
   - `.agents/results/` - outputs
   - NO Redis, NO RabbitMQ, NO message brokers

### Готово к написанию CONTRACT:

- ✅ Agent Registry pattern
- ✅ Task Queue protocol
- ✅ Orchestrator workflow
- ✅ Worker Agent template
- ✅ Agent Creator specification
- ✅ Execution models (3 варианта)

### Следующий шаг:

Написать `CONTRACT-MULTI-AGENT-ORCHESTRATION.yml` на основе этих находок.

---

## 🔍 Git Worktree & File Isolation Research (продолжение)

### 🎯 Git Worktree для Multi-Agent систем

**Что такое git worktree:**
```bash
git worktree add ../agent-branch-1 feature-branch
# Создаёт ОТДЕЛЬНУЮ папку с тем же .git
# Но в другой рабочей директории
```

**Преимущества для agents:**
- ✅ Полная изоляция файловой системы
- ✅ Разные ветки одновременно
- ✅ Нет conflicts между агентами
- ✅ Один .git репозиторий (shared history)

**Use case (из Medium):**
```
project/
├── .git/
├── main-workspace/          # Orchestrator
├── agent-1-workspace/       # Contract Steward на ветке agent-1
└── agent-2-workspace/       # Code Artisan на ветке agent-2
```

**Workflow:**
1. Orchestrator создаёт ветку для каждого агента
2. `git worktree add` для каждого агента
3. Агенты работают изолированно
4. Merge обратно через PR/merge

---

### 📊 Варианты File Isolation (финальное сравнение)

| Подход | Isolation | Complexity | Git Strategy | Merge Effort |
|--------|-----------|------------|--------------|--------------|
| **Shared Workspace** | ❌ Conflicts | Low | Single branch | High (conflicts) |
| **Git Worktrees** | ✅ Full | Medium | Multi-branch | Medium (PRs) |
| **Result Zones** | ✅ Partial | Low | Single branch | Low (copy files) |
| **Git Forks** | ✅ Full | High | Multiple repos | High (cross-repo) |

---

### 💡 Рекомендация для Cascade (на основе research)

**MVP: Result Zones (Shared Workspace + Isolated Write)**

```
project/
├── .git/                          # Один repo
├── .agents/
│   ├── registry/*.md              # Agent definitions
│   ├── tasks/*.json               # Shared read (task queue)
│   └── results/                   # Isolated write zones
│       ├── contract-steward/
│       │   ├── CONTRACT-BUTTON.yml
│       │   └── metadata.json
│       ├── code-artisan/
│       │   ├── Button.tsx
│       │   └── metadata.json
│       └── orchestrator/
│           └── execution-log.md
│
└── components/                    # Final destination
    └── Button.tsx                # Orchestrator копирует сюда
```

**Workflow:**
1. ✅ Orchestrator создаёт task → `.agents/tasks/task-001.json`
2. ✅ Contract Steward пишет → `.agents/results/contract-steward/CONTRACT-BUTTON.yml`
3. ✅ Code Artisan читает contract → пишет `.agents/results/code-artisan/Button.tsx`
4. ✅ Orchestrator копирует → `components/Button.tsx`
5. ✅ Human делает `git add` + `git commit`

**Преимущества:**
- ✅ Нет git conflicts (каждый пишет в свою зону)
- ✅ Простота (не нужны worktrees)
- ✅ Audit trail (видно кто что создал)
- ✅ Rollback по агентам
- ✅ Sequential OR parallel execution

**Недостатки:**
- ❌ Agents видят весь workspace (могут читать чужие файлы)
- ❌ Нет git-level isolation

---

**Advanced: Git Worktrees (для параллельных агентов)**

```bash
# Orchestrator создаёт worktree для каждого агента
git worktree add ../workspace-contract-steward agent-contract-steward
git worktree add ../workspace-code-artisan agent-code-artisan

# Запускает agents в разных worktrees
cascade --cwd=../workspace-contract-steward --system-prompt=.agents/registry/contract-steward.md
cascade --cwd=../workspace-code-artisan --system-prompt=.agents/registry/code-artisan.md

# После завершения - merge branches
git merge agent-contract-steward
git merge agent-code-artisan
```

**Когда использовать:**
- ✅ Параллельная работа agents (2+ одновременно)
- ✅ Нужна git-level isolation
- ✅ Сложные merge strategies

**Недостатки:**
- ❌ Сложность setup
- ❌ Merge conflicts возможны
- ❌ Больше disk space

---

### 🎯 Финальная рекомендация для CONTRACT

**Стратегия:**
1. **MVP:** Result Zones (simple, works)
2. **V2:** Git Worktrees (advanced, parallel)
3. **Documentation:** Опишите оба подхода в CONTRACT

**Что включить в CONTRACT-MULTI-AGENT-ORCHESTRATION.yml:**

```yaml
file_isolation:
  strategy: "result-zones"  # or "git-worktrees"
  
  result_zones:
    description: "Each agent writes to isolated directory"
    structure:
      tasks: ".agents/tasks/"      # Shared read
      results: ".agents/results/"  # Isolated write
    pros: ["Simple", "No conflicts", "Audit trail"]
    cons: ["No git isolation", "Agents see all files"]
  
  git_worktrees:
    description: "Each agent works in separate git worktree"
    workflow:
      - "Create branch per agent"
      - "git worktree add for each"
      - "Agents work in isolation"
      - "Merge branches when done"
    pros: ["Full isolation", "Git-level safety", "Parallel work"]
    cons: ["Complex setup", "Merge conflicts", "Disk space"]
```

---

## ✅ GIT ISOLATION RESEARCH ЗАВЕРШЁН

**Дата:** 2025-10-10  
**Время:** 20:55  
**Вопрос:** Как agents должны работать с Git/FileSystem без конфликтов?

### Исследовано:

**Источники:**
- ✅ Medium: Git Worktree + AI Agents
- ✅ Blog: Parallel AI Coding with Git Worktrees
- ✅ Reddit: Parallelizing AI Coding Agents
- ✅ Azure: AI Agent Design Patterns

**Найденные подходы:**
1. **Shared Workspace** - конфликты гарантированы ❌
2. **Result Zones** - изоляция через directories ✅
3. **Git Worktrees** - полная git isolation ✅
4. **Git Forks** - overkill для нашего случая ❌

### Финальное решение:

**MVP: Result Zones**
- Просто, работает
- Каждый agent пишет в свою папку
- Orchestrator финально мержит
- Подходит для sequential И parallel

**V2: Git Worktrees**  
- Для сложных случаев
- Полная git isolation
- Параллельная работа 2+ agents

### Добавлено в CONTRACT spec:

```yaml
file_isolation:
  strategy: "result-zones"  # MVP
  alternative: "git-worktrees"  # Advanced
```

---

## 🎯 ИТОГО: ВСЁ ИССЛЕДОВАНИЕ ЗАВЕРШЕНО ✅

**Исследовано:**
1. ✅ Agent Creator концепция
2. ✅ Multi-agent architectures (4 фреймворка)
3. ✅ Workflow patterns (sequential/parallel/hierarchical)
4. ✅ Communication patterns (graph/pubsub/file-based)
5. ✅ **Git/FileSystem isolation strategies** ← НОВОЕ

**Готово к CONTRACT:**
- ✅ Agent Registry pattern
- ✅ Task Queue protocol
- ✅ Orchestrator workflow
- ✅ Worker Agent templates
- ✅ Agent Creator specification
- ✅ Execution models (3 варианта)
- ✅ **File isolation strategies (2 варианта)** ← НОВОЕ

**Файл ultra-think-findings.md:** 1692 строки

### Следующий шаг:

Написать полный `CONTRACT-MULTI-AGENT-ORCHESTRATION.yml` включая file isolation strategies.

---

## 🤔 CRITICAL GAPS ANALYSIS

### Что ТОЧНО есть ✅

**Архитектурный уровень:**
- ✅ Agent Registry (где хранятся system prompts)
- ✅ Task Queue (где лежат tasks)
- ✅ File Isolation (как agents не конфликтуют)
- ✅ Communication (file-based через tasks/results)
- ✅ Orchestrator Role (координирует, не делает работу)
- ✅ Worker Pattern (polling, специализация)
- ✅ Agent Creator (meta-agent для промптов)

**Workflow уровень:**
- ✅ Sequential execution pattern
- ✅ Parallel execution возможность
- ✅ Handoff pattern (task → agent → result)

---

### Что МОЖЕТ быть упущено 🔍

**1. Task Status & Lifecycle** ⚠️ ВАЖНО
```
Вопрос: Как отслеживается статус tasks?

Варианты:
A) В самом task file:
   {
     "id": "task-001",
     "status": "pending" → "running" → "completed"
   }

B) Отдельный status file:
   .agents/status/task-001.status

C) Move file между папками:
   .agents/tasks/pending/ → running/ → completed/

Что мы выбираем? 🤔
```

**2. Task Dependencies** ⚠️ ВАЖНО
```
Вопрос: Как task знает что его dependencies выполнены?

Сценарий:
- Task 1: Contract Steward создаёт contract
- Task 2: Code Artisan НЕ МОЖЕТ начать пока Task 1 не done

Варианты:
A) Dependencies в task:
   {
     "id": "task-002",
     "depends_on": ["task-001"],
     "status": "waiting"
   }

B) Orchestrator сам следит:
   - Проверяет results/
   - Создаёт task-002 только когда task-001 done

Что выбираем? 🤔
```

**3. Error Handling** ⚠️ СРЕДНЕ
```
Вопрос: Что если agent failed?

Сценарий:
- Contract Steward создаёт invalid YAML
- Должен ли retry?
- Кто решает - retry или abort?

Варианты:
A) Task с error status:
   {
     "status": "failed",
     "error": "Invalid YAML syntax",
     "retry_count": 0
   }

B) Orchestrator видит failed → решает что делать

Нужно в CONTRACT? 🤔
```

**4. Agent Context & Memory** ❓ НИЗКИЙ ПРИОРИТЕТ
```
Вопрос: Что agent помнит между tasks?

Варианты:
A) Stateless - каждый task независим
B) Persistent context - agent помнит предыдущие tasks
C) Shared memory - agents видят работу друг друга

Рекомендация: Stateless для MVP (проще)
```

**5. Orchestrator Polling Logic** ❓ IMPLEMENTATION DETAIL
```
Вопрос: Как часто orchestrator проверяет results?

- Polling interval (каждые 5 сек?)
- Event-driven (file watcher?)
- Blocking wait?

Рекомендация: Implementation detail, не для CONTRACT
```

---

### 🎯 Что НУЖНО добавить в CONTRACT

**КРИТИЧНО:**
1. ✅ **Task Status Protocol**
   - Как меняется status (pending → running → completed/failed)
   - Где хранится status (в task file или отдельно)

2. ✅ **Task Dependencies Protocol**
   - Как описываются dependencies
   - Как agent проверяет что dependencies готовы

**ЖЕЛАТЕЛЬНО:**
3. ⚠️ **Error Handling Strategy**
   - Как обозначается failed task
   - Retry logic (да/нет, кто решает)

**НЕ НУЖНО (implementation details):**
- ❌ Polling intervals
- ❌ Agent spawning механизм (bash/python/etc)
- ❌ Logging infrastructure
- ❌ Monitoring dashboards

---

### 💡 Мои рекомендации

**Вариант A: Добавить сейчас (5-10 минут)** ⚡
- Task Status Protocol
- Task Dependencies Protocol
- Basic Error Handling

**Вариант B: Писать CONTRACT сейчас, добавить по ходу** 📝
- Начать писать CONTRACT
- Когда дойдём до Task Queue - определим protocol
- Итеративно дополняем

**Вариант C: Достаточно как есть** ✅
- Task status = наличие файла в results/
- Dependencies = orchestrator следит сам
- Errors = orchestrator видит пустой/invalid result
- Всё остальное - implementation details

---

## 🤔 Мой вывод:

**У нас 95% для CONTRACT готово.** 

Оставшиеся 5% - это детали Task Queue protocol которые:
- Можно определить прямо в CONTRACT (пока пишем)
- Или сделать flexible (несколько вариантов)

**Предлагаю: переходить к CONTRACT** и по ходу определим недостающие детали Task Status и Dependencies.

**Альтернатива:** Если хочешь 100% уверенность - могу за 5 минут быстро найти примеры Task Queue protocols (JSON schema для task files с status/dependencies). Но это optional.

**Что выбираешь?** 🚀

---

## 🔍 CONTRACT-AGENT-CREATOR.yml Review (2025-10-10 21:10)

**Проверка существующего CONTRACT на соответствие новым знаниям из research.**

### ✅ Что ПРАВИЛЬНО:

1. **Agent Creator = Meta-Agent** - генерирует других агентов ✅
2. **Tier System** (Orchestration/Core/Specialist) ✅
3. **Context Optimization** (<50KB budget) ✅
4. **Anthropic Patterns** (Orchestrator-Workers, etc) ✅

### ❌ КРИТИЧНЫЕ НЕСООТВЕТСТВИЯ:

**Проблема 1: Output Format**
```yaml
# Сейчас в CONTRACT:
output: "AGENT-{NAME}-001.yml" (700 lines YAML spec)

# ДОЛЖНО БЫТЬ (из research):
output: ".agents/registry/agent-name.md" (simple system prompt)
```

**Проблема 2: Вымышленные Tools**
```yaml
# Сейчас:
tools: ["agent spawner", "task queue", "YAML validator"]

# ДОЛЖНО (только Cascade native):
tools: ["read_file", "write_file", "list_dir"]
```

**Проблема 3: Overcomplicated Structure**
```
Сейчас: AGENT-{NAME}-001.yml с 8+ секциями
        (system_prompt, input_contract, output_contract, 
         context_requirements, tools, validation, failure_modes, etc)

Должно: .agents/registry/agent-name.md (system prompt)
        + entry в registry.json (metadata)
```

### 🔧 Что исправить:

1. **Упростить Output:**
   - Agent Creator пишет `.md` файлы в `.agents/registry/`
   - НЕ создаёт сложные YAML спецификации

2. **Реальные Tools:**
   - Только Cascade built-in: read_file, write_file, list_dir
   - Убрать вымышленные: "agent spawner", "task queue"

3. **Align с CONTRACT-MULTI-AGENT-ORCHESTRATION:**
   - Agent Creator создаёт то что описано в orchestration contract
   - Единая терминология и структура

4. **System Prompt Template:**
   ```markdown
   # Agent Name
   
   You are {Agent} - specialized in {domain}.
   
   ## Your Role
   {description}
   
   ## Your Workflow
   1. Poll .agents/tasks/ for your agent_type
   2. Process task
   3. Write result to .agents/results/{your-type}/
   
   ## Your Context Files
   - {list files to read}
   
   ## Your Tools
   - read_file, write_file
   ```

### 📝 Action Items:

- [ ] Обновить `agent_specification_format` в CONTRACT-AGENT-CREATOR.yml
- [ ] Изменить output с YAML spec на .md system prompt
- [ ] Убрать вымышленные tools
- [ ] Упростить workflow (3-4 шага вместо 7)
- [ ] Добавить примеры .md system prompts

**Статус:** CONTRACT-AGENT-CREATOR.yml нужно обновить для соответствия research findings.

---

## 🔥 Agent-MCP Analysis (2025-10-10 21:14)

**Источник:** https://github.com/rinadelph/Agent-MCP

### Что это такое:

**Agent-MCP** = Multi-agent framework используя **MCP (Model Context Protocol)**

- MCP = Официальный стандарт от Anthropic для подключения tools/data sources
- Agent-MCP = Python сервер работающий как MCP server
- Предназначен для **Claude Desktop** (не Claude Code/Cascade напрямую)

### Архитектура Agent-MCP:

```
Claude Desktop
    ↓ (MCP Protocol)
Agent-MCP Server (Python)
    ↓
├── Admin Agent (orchestrator)
├── Worker Agents (ephemeral)
└── Knowledge Graph (RAG)
```

**MCP Tools предоставляемые Agent-MCP:**

```python
Agent Management:
- create_agent      # Создать нового агента
- list_agents       # Список активных агентов
- terminate_agent   # Убить агента

Task Orchestration:
- assign_task            # Назначить задачу агенту
- view_tasks             # Мониторинг прогресса
- update_task_status     # Обновить статус

Knowledge Management:
- ask_project_rag           # Запрос к knowledge graph
- update_project_context    # Добавить контекст
- view_project_context      # Читать контекст

Communication:
- send_agent_message    # Direct messaging между агентами
- broadcast_message     # Broadcast всем
- request_assistance    # Escalate проблему
```

### Ключевые концепции:

**1. Ephemeral Agents (короткоживущие):**
```
Traditional: Один агент на весь проект (context bloat)
Agent-MCP:   Новый агент для каждой задачи (focused context)

Пример:
- Agent 1: Create auth tables → done → terminate
- Agent 2: Build API endpoints → done → terminate
- Agent 3: Write tests → done → terminate
```

**2. Shared Knowledge Graph:**
```
Все агенты читают/пишут в persistent RAG
- MCD (Main Context Document) = project blueprint
- Архитектурные решения
- Coding patterns
- Task dependencies
```

**3. MCP Protocol:**
```yaml
# claude_desktop_config.json
{
  "mcpServers": {
    "agent-mcp": {
      "command": "uv",
      "args": ["run", "-m", "agent_mcp.cli", "--port", "8080"],
      "env": {
        "OPENAI_API_KEY": "..."
      }
    }
  }
}
```

---

### 📊 Сравнение с нашим подходом:

| Аспект | Наш File-Based | Agent-MCP |
|--------|----------------|-----------|
| **Protocol** | File system | MCP (official Anthropic standard) |
| **Communication** | .agents/tasks/*.json | MCP tool calls |
| **Memory** | File-based results | Knowledge Graph (RAG) |
| **Agent Lifecycle** | Persistent sessions | Ephemeral (create/terminate) |
| **Orchestration** | Orchestrator reads files | Admin agent calls MCP tools |
| **Target** | Cascade CLI | Claude Desktop |
| **Implementation** | No code (configuration) | Python server required |

---

### 🤔 Можно ли использовать для Cascade?

**ВАЖНО:** Agent-MCP работает с **Claude Desktop**, но Cascade **ПОДДЕРЖИВАЕТ MCP**!

**Вариант 1: Использовать Agent-MCP напрямую ❓**
```
Cascade → MCP Client → Agent-MCP Server → Agents

Проблема:
- Agent-MCP создаёт Claude Desktop agents (не Cascade sessions)
- Cascade не умеет spawn other Cascade sessions через MCP
```

**Вариант 2: Адаптировать концепции ✅**
```
Использовать идеи из Agent-MCP:

1. Ephemeral Agents:
   - Cascade session для одной задачи
   - Terminate после completion

2. MCP Tools для orchestration:
   - create_task (вместо create_agent)
   - assign_task
   - query_context

3. Knowledge Graph:
   - .agents/context/knowledge-graph.json
   - RAG через MCP server (отдельный)
```

**Вариант 3: Гибрид ⚡**
```
File-Based (наш) + MCP Tools (Agent-MCP идеи):

.agents/
├── tasks/*.json           # File-based queue (simple)
├── results/               # File-based outputs
└── context/
    └── knowledge.json     # Optional: RAG integration

+ MCP Server (optional):
  - Предоставляет query_knowledge tool
  - Agents используют через MCP
```

---

### 💡 Выводы для нашего CONTRACT:

**Что взять из Agent-MCP:**

1. ✅ **Ephemeral Agent Pattern**
   - Cascade session = одна задача
   - После completion → terminate session
   - Prevent context bloat

2. ✅ **Knowledge Graph идея**
   - Persistent context store
   - Agents query перед началом работы
   - Можно через MCP server или file-based

3. ✅ **Task Status Management**
   - assign_task, view_tasks, update_task_status
   - Можем адаптировать для file-based

4. ✅ **MCD (Main Context Document)**
   - Project blueprint как single source of truth
   - У нас это contracts/ + METACONTRACT

**Что НЕ брать:**

1. ❌ **Python Server Dependency**
   - Мы хотим configuration-only approach
   - Agent-MCP требует running Python server

2. ❌ **Claude Desktop специфика**
   - Мы для Cascade, не Desktop

3. ❌ **Complex RAG infrastructure**
   - MVP: простой file-based
   - V2: можем добавить MCP knowledge server

---

### 🎯 Рекомендация:

**Для CONTRACT-MULTI-AGENT-ORCHESTRATION.yml:**

1. **Добавить секцию:** "Ephemeral vs Persistent Agents"
   ```yaml
   agent_lifecycle:
     mvp: "Persistent (session per agent type)"
     advanced: "Ephemeral (session per task)"
   ```

2. **Добавить секцию:** "Knowledge Management"
   ```yaml
   knowledge_store:
     simple: "File-based context files"
     advanced: "MCP knowledge server (optional)"
   ```

3. **Добавить референс:**
   ```yaml
   references:
     agent_mcp: "https://github.com/rinadelph/Agent-MCP"
     concepts_used:
       - "Ephemeral agents"
       - "Task-focused context"
       - "Shared knowledge graph"
   ```

4. **НЕ добавлять:** Python server requirement (против нашей философии)

**Agent-MCP показал нам лучшую практику (ephemeral agents), но мы адаптируем для Cascade без Python server.**

---

