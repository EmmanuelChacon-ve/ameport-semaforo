const API_URL = import.meta.env.VITE_API_URL;

/** Build auth headers from stored token */
function authHeaders() {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Fetch activities from the backend.
 * @param {string} [department] — filter by department name
 * @param {string} [category] — filter by category name
 * @returns {Promise<Array>} array of activity objects
 */
export async function fetchActivities(department, category) {
  const params = new URLSearchParams();
  if (department) params.set('department', department);
  if (category) params.set('category', category);

  const url = `${API_URL}/activities${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url, { headers: authHeaders() });
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener actividades');
  }

  return data.activities;
}

/**
 * Fetch all departments from the backend.
 * @returns {Promise<Array>} array of department objects
 */
export async function fetchDepartments() {
  const res = await fetch(`${API_URL}/departments`, { headers: authHeaders() });
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener departamentos');
  }

  return data.departments;
}

/**
 * Fetch ALL activities from the backend (no department filter).
 * @returns {Promise<Array>} array of activity objects
 */
export async function fetchAllActivities() {
  const url = `${API_URL}/activities`;
  const res = await fetch(url, { headers: authHeaders() });
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener actividades');
  }

  return data.activities;
}

/**
 * Fetch departments metadata (name, coordinator, color, icon, categories, categoryColors).
 * @returns {Promise<Array>} array of department metadata objects
 */
export async function fetchDepartmentsMetadata() {
  const res = await fetch(`${API_URL}/departments`, { headers: authHeaders() });
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener departamentos');
  }

  return data.departments;
}

/**
 * Update the manualStatus of an activity (admin only).
 * @param {string} activityId — Firestore document ID (e.g. 'sis-1')
 * @param {string|null} manualStatus — new status or null to clear
 * @param {string} token — Firebase auth token
 * @param {string} [observation] — optional observation (required for Atrasado/No Realizado)
 */
export async function updateActivityStatus(activityId, manualStatus, token, observation) {
  const body = { manualStatus };
  if (observation) body.observation = observation;

  const res = await fetch(`${API_URL}/activities/${activityId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al actualizar estado');
  }

  return data;
}

/**
 * Create a new activity (admin or coordinator).
 * @param {{ name: string, department: string, category: string, startMonth: number, endMonth: number }} activityData
 * @param {string} token — Firebase auth token
 */
export async function createNewActivity(activityData, token) {
  const res = await fetch(`${API_URL}/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(activityData),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al crear actividad');
  }

  return data;
}

/**
 * Delete an activity (admin only).
 * @param {string} activityId — Firestore document ID
 * @param {string} token — Firebase auth token
 */
export async function deleteActivityById(activityId, token) {
  const res = await fetch(`${API_URL}/activities/${activityId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al eliminar actividad');
  }

  return data;
}

/**
 * Add a new category to a department (admin only).
 * @param {string} departmentId — Firestore document ID of the department
 * @param {string} categoryName — name of the new category
 * @param {string} token — Firebase auth token
 */
export async function addDepartmentCategory(departmentId, categoryName, token) {
  const res = await fetch(`${API_URL}/departments/${departmentId}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ categoryName }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al crear categoría');
  }

  return data;
}

// ═══════════════════════════════════════════════════════════
// STATUS REQUESTS (Coordinator → Admin approval flow)
// ═══════════════════════════════════════════════════════════

/**
 * Create a status change request (coordinator).
 * @param {string} activityId
 * @param {string} requestedStatus
 * @param {string} reason
 */
export async function createStatusRequest(activityId, requestedStatus, reason) {
  const res = await fetch(`${API_URL}/status-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ activityId, requestedStatus, reason }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al crear solicitud');
  }

  return data;
}

/**
 * Fetch status requests.
 * Admin: all pending. Coordinator: own requests.
 * @param {string} [status] — filter: pending, approved, rejected
 */
export async function fetchStatusRequests(status) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);

  const url = `${API_URL}/status-requests${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url, { headers: authHeaders() });
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener solicitudes');
  }

  return data.requests;
}

/**
 * Resolve a status request (admin only).
 * @param {string} requestId
 * @param {'approved'|'rejected'} action
 * @param {string} [adminNote]
 */
export async function resolveStatusRequest(requestId, action, adminNote) {
  const res = await fetch(`${API_URL}/status-requests/${requestId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ action, adminNote }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al resolver solicitud');
  }

  return data;
}

// ═══════════════════════════════════════════════════════════
// OBSERVATIONS (Activity comments/notes)
// ═══════════════════════════════════════════════════════════

/**
 * Add an observation to an activity.
 * @param {string} activityId
 * @param {string} text
 * @param {string} [type] — 'general', 'delay_reason', 'status_change'
 */
export async function addObservation(activityId, text, type) {
  const res = await fetch(`${API_URL}/activities/${activityId}/observations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ text, type }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al agregar observación');
  }

  return data;
}

/**
 * Fetch observations for an activity.
 * @param {string} activityId
 */
export async function fetchObservations(activityId) {
  const res = await fetch(`${API_URL}/activities/${activityId}/observations`, {
    headers: authHeaders(),
  });
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener observaciones');
  }

  return data.observations;
}

// ═══════════════════════════════════════════════════════════
// OBSERVATION READ COUNTS (per-user persistence)
// ═══════════════════════════════════════════════════════════

/**
 * Fetch the per-user observation read-count map.
 * @returns {Promise<Object>} { activityId: lastReadCount, ... }
 */
export async function fetchObsReadCounts() {
  const res = await fetch(`${API_URL}/activities/obs-read-counts`, {
    headers: authHeaders(),
  });
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al obtener conteos de lectura');
  }

  return data.counts;
}

/**
 * Mark an activity's observations as read for the current user.
 * @param {string} activityId
 * @param {number} count — latest observation count
 */
export async function markObsReadApi(activityId, count) {
  const res = await fetch(`${API_URL}/activities/obs-read-counts`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ activityId, count }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Error al marcar como leído');
  }

  return data;
}

// ═══════════════════════════════════════════════════════════
// SINGLE ACTIVITY DETAIL (with milestones + progress)
// ═══════════════════════════════════════════════════════════

/**
 * Fetch a single activity by ID (includes milestones + progress).
 * @param {string} activityId
 * @returns {Promise<Object>} activity object with milestones
 */
export async function fetchActivityById(activityId) {
  const res = await fetch(`${API_URL}/activities/${activityId}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al obtener actividad');
  return data.activity;
}

// ═══════════════════════════════════════════════════════════
// MILESTONES (subtasks per activity)
// ═══════════════════════════════════════════════════════════

/**
 * Fetch milestones for an activity.
 * @param {string} activityId
 */
export async function fetchMilestones(activityId) {
  const res = await fetch(`${API_URL}/activities/${activityId}/milestones`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al obtener hitos');
  return data;
}

/**
 * Create a new milestone.
 * @param {string} activityId
 * @param {string} title
 * @param {string} dueDate — ISO date string "YYYY-MM-DD"
 */
export async function createMilestone(activityId, title, dueDate) {
  const res = await fetch(`${API_URL}/activities/${activityId}/milestones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ title, dueDate }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al crear hito');
  return data;
}

/**
 * Update a milestone's title and/or dueDate.
 */
export async function updateMilestoneApi(activityId, milestoneId, updates) {
  const res = await fetch(`${API_URL}/activities/${activityId}/milestones/${milestoneId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al actualizar hito');
  return data;
}

/**
 * Toggle a milestone's completed status.
 * @param {string} activityId
 * @param {string} milestoneId
 * @param {boolean} completed
 */
export async function toggleMilestoneApi(activityId, milestoneId, completed) {
  const res = await fetch(`${API_URL}/activities/${activityId}/milestones/${milestoneId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ completed }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al actualizar hito');
  return data;
}

/**
 * Delete a milestone.
 * @param {string} activityId
 * @param {string} milestoneId
 */
export async function deleteMilestoneApi(activityId, milestoneId) {
  const res = await fetch(`${API_URL}/activities/${activityId}/milestones/${milestoneId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al eliminar hito');
  return data;
}

/**
 * Add a follow-up comment to a specific milestone.
 * @param {string} activityId
 * @param {string} milestoneId
 * @param {string} text
 */
export async function addMilestoneComment(activityId, milestoneId, text) {
  const res = await fetch(
    `${API_URL}/activities/${activityId}/milestones/${milestoneId}/comments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ text }),
    }
  );
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Error al agregar comentario');
  return data;
}
