
export interface TemplateObj {
    name: string,
    description: string,
    template_id: string,
    span: number,
    permissions: string,
    author_id: string
}

// ==============Task refers to the template event ============

export interface TaskObj {
    id: string,
    position: number,
    position_units: 'days' | 'weeks' | 'months',
    category: string,
    description: string,
    entity_responsible: string,
    type: string,
    template_id: string,
    author_id: string
}

export interface CampaignObj {
    id: string,

}

export interface EventObj {
    id: string,
    position: number,
    category: string,
    description: string,
    entity_responsible: string,
    type: string,
    campaign_id: string,
    author_id: string
} 