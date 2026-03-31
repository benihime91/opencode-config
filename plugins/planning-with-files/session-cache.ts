/**
 * Planning with Files — session cache
 *
 * Tracks session agent roles plus per-call planning metadata.
 */

import { PLANNING_FILE_OWNERS, PLANNING_SKILL_AGENTS } from './constants'

export class PlanningSessionCache {
  private sessionAgents = new Map<string, string>()
  private lastStatuses = new Map<string, string>()
  private pendingPlans = new Map<string, string>()
  private pendingTaskAgents = new Map<string, string>()

  registerSession(sessionID: string, agent?: string): void {
    if (!agent) return

    this.sessionAgents.set(sessionID, agent)
    if (!PLANNING_FILE_OWNERS.has(agent)) {
      this.lastStatuses.delete(sessionID)
    }
  }

  hasKnownAgent(sessionID?: string): boolean {
    return sessionID ? this.sessionAgents.has(sessionID) : false
  }

  isPlanningSkillSession(sessionID?: string): boolean {
    const agent = sessionID ? this.sessionAgents.get(sessionID) : undefined
    return agent ? PLANNING_SKILL_AGENTS.has(agent) : false
  }

  isPlanningFileOwner(sessionID?: string): boolean {
    const agent = sessionID ? this.sessionAgents.get(sessionID) : undefined
    return agent ? PLANNING_FILE_OWNERS.has(agent) : false
  }

  shouldAppendStatus(sessionID: string, status: string): boolean {
    const lastStatus = this.lastStatuses.get(sessionID)
    if (lastStatus === status) return false

    this.lastStatuses.set(sessionID, status)
    return true
  }

  rememberPendingPlan(callID: string, head: string): void {
    this.pendingPlans.set(callID, head)
  }

  takePendingPlan(callID: string): string | undefined {
    const plan = this.pendingPlans.get(callID)
    this.pendingPlans.delete(callID)
    return plan
  }

  rememberPendingTaskAgent(callID: string, subagentType?: string): void {
    if (!subagentType) return
    this.pendingTaskAgents.set(callID, subagentType)
  }

  takePendingTaskAgent(callID: string): string | undefined {
    const subagentType = this.pendingTaskAgents.get(callID)
    this.pendingTaskAgents.delete(callID)
    return subagentType
  }
}
