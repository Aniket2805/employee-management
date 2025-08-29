export interface AuditLog {
    id: number
    entityName: string
    entityId: string
    action: string
    actor: string
    payload: string
    timestamp: string
}