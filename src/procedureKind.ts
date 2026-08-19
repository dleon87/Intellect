/**
 * Which of the three Procedures-page sections a procedure belongs to. Drives
 * timeline content, the collaborator panel, title editability, and the
 * status banner on the procedure detail view — see ProcedureHeader.tsx.
 */
export type ProcedureKind = 'local' | 'managed' | 'from-hub'
