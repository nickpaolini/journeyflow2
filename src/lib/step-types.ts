export const STEP_TYPES = {
  ACTION: {
    id: 'action',
    label: 'Action',
    icon: '⚡',
    color: '#10b981'
  },
  DECISION: {
    id: 'decision',
    label: 'Decision',
    icon: '❓',
    color: '#f59e0b'
  },
  WAIT: {
    id: 'wait',
    label: 'Wait',
    icon: '⏱️',
    color: '#6b7280'
  },
  EMAIL: {
    id: 'email',
    label: 'Email',
    icon: '📧',
    color: '#3b82f6'
  },
  SMS: {
    id: 'sms',
    label: 'SMS',
    icon: '📱',
    color: '#8b5cf6'
  },
  WEBHOOK: {
    id: 'webhook',
    label: 'Webhook',
    icon: '🔗',
    color: '#ef4444'
  },
  FEEDBACK: {
    id: 'feedback',
    label: 'Feedback',
    icon: '💬',
    color: '#FFD700'
  },
  DISCOVERY: {
    id: 'discovery',
    label: 'Discovery',
    icon: '🔍',
    color: '#00BFFF'
  },
  SUPPORT: {
    id: 'support',
    label: 'Support',
    icon: '🆘',
    color: '#06b6d4'
  },
  MILESTONE: {
    id: 'milestone',
    label: 'Milestone',
    icon: '🏁',
    color: '#84cc16'
  },
  INTERNAL: {
    id: 'internal',
    label: 'Internal Process',
    icon: '⚙️',
    color: '#64748b'
  }
} as const

export const getStepTypeById = (id: string) => {
  return Object.values(STEP_TYPES).find(type => type.id === id)
}

export const getStepTypeByLabel = (label: string) => {
  return Object.values(STEP_TYPES).find(type => type.label === label)
} 