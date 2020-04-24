export const createToken = (endpoint: string) => ({
  url: `${endpoint}/permission`,
  method: 'POST',
})

export const deleteToken = (endpoint: string) => ({
  url: `${endpoint}/permission`,
  method: 'DELETE',
})

export const setScope = (endpoint: string) => ({
  url: `${endpoint}/permission/scope`,
  method: 'POST',
})

export const removeScope = (endpoint: string) => ({
  url: `${endpoint}/permission/scope`,
  method: 'DELETE',
})

export const extendScope = (endpoint: string) => ({
  url: `${endpoint}/permission/scope`,
  method: 'PUT',
})

export const publishModule = (endpoint: string) => ({
  url: `${endpoint}/module`,
  method: 'POST',
})

// User

export const createUser = (endpoint: string) => ({
  url: `${endpoint}/user`,
  method: 'POST',
})

export const loginUser = (endpoint: string) => ({
  url: `${endpoint}/user/login`,
  method: 'POST',
})

export const createTokenForUser = (endpoint: string) => ({
  url: `${endpoint}/user/token`,
  method: 'POST',
})

export const deleteTokenFromUser = (endpoint: string) => ({
  url: `${endpoint}/user/token`,
  method: 'DELETE',
})

// Scope

export const addCollaboratorToScope = (endpoint: string) => ({
  url: `${endpoint}/scope/collaborator`,
  method: 'POST',
})

export const updateCollaboratorOfScope = (endpoint: string) => ({
  url: `${endpoint}/scope/collaborator`,
  method: 'PUT',
})

export const removeCollaboratorFromScope = (endpoint: string) => ({
  url: `${endpoint}/scope/collaborator`,
  method: 'DELETE',
})

// Module

export const addCollaboratorToModule = (endpoint: string) => ({
  url: `${endpoint}/module/collaborator`,
  method: 'POST',
})

export const updateCollaboratorOfModule = (endpoint: string) => ({
  url: `${endpoint}/module/collaborator`,
  method: 'PUT',
})

export const removeCollaboratorFromModule = (endpoint: string) => ({
  url: `${endpoint}/module/collaborator`,
  method: 'DELETE',
})

// Composition

export const addCollaboratorToComposition = (endpoint: string) => ({
  url: `${endpoint}/composition/collaborator`,
  method: 'POST',
})

export const updateCollaboratorOfComposition = (endpoint: string) => ({
  url: `${endpoint}/composition/collaborator`,
  method: 'PUT',
})

export const removeCollaboratorFromComposition = (endpoint: string) => ({
  url: `${endpoint}/composition/collaborator`,
  method: 'DELETE',
})
