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
 */
export async function updateActivityStatus(activityId, manualStatus, token) {
  const res = await fetch(`${API_URL}/activities/${activityId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ manualStatus }),
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
