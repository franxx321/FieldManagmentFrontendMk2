// Mock API functions - replace these with your actual backend endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Auth API
export async function login(email: string, password: string) {
  // Mock API call - replace with your actual endpoint
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  return response.json()
}

export async function logout() {
  // Mock API call - replace with your actual endpoint
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
  })
  return response.json()
}

export async function getCurrentUser() {
  // Mock API call - replace with your actual endpoint
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}

// Farm API
export async function getFarms() {
  const response = await fetch(`${API_BASE_URL}/farms`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}

export async function getFarm(id: string) {
  const response = await fetch(`${API_BASE_URL}/farms/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
    return response.json()
}


export async function createFarm(farm: { name: string; location: string; area: number }) {
  const response = await fetch(`${API_BASE_URL}/farms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(farm),
  })
  return response.json()
}

// Plot API
export async function getPlots(farmId: string) {
  const response = await fetch(`${API_BASE_URL}/farms/${farmId}/plots`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}

export async function getPlot(id: string) {
    const response = await fetch(`${API_BASE_URL}/plots/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    return response.json()
}

export async function createPlot(plot: {
  name: string
  area: number
  coordinates: string
  polygon?: string
  farm_id: string
}) {
  const response = await fetch(`${API_BASE_URL}/plots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(plot),
  })
  return response.json()
}

export async function updatePlot(
  id: string,
  plot: { name?: string; area?: number; coordinates?: string; polygon?: string },
) {
  const response = await fetch(`${API_BASE_URL}/plots/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(plot),
  })
  return response.json()
}

// Row API
export async function getRows(plotId: string) {
  const response = await fetch(`${API_BASE_URL}/plots/${plotId}/rows`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}

export async function getRow(id: string) {
    const response = await fetch(`${API_BASE_URL}/plot_rows/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    return response.json()
}

export async function createRow(row: { name: string; length: number; width: number; plot_id: string }) {
  const response = await fetch(`${API_BASE_URL}/plot_rows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(row),
  })
  return response.json()
}

export async function updateRow(id: string, row: { name?: string; length?: number; width?: number }) {
  const response = await fetch(`${API_BASE_URL}/plot_rows/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(row),
  })
  return response.json()
}

// Plant API
export async function getPlants(rowId: string) {
  const response = await fetch(`${API_BASE_URL}/plot_rows/${rowId}/plants`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}

export async function getPlant(id: string) {
    const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    return response.json()
}

export async function createPlant(plant: {
  speciesId: string
  position: number
  status: "HEALTHY" | "DISEASED" | "NEEDSATTENTION"
  plotRowId: string
}) {
  const response = await fetch(`${API_BASE_URL}/plants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(plant),
  })
  return response.json()
}

export async function batchCreatePlants(plants: { plotRowId: string; speciesId: string; quantity: number; status: "HEALTHY" | "DISEASED" | "NEEDSATTENTION"  }) {
  const response = await fetch(`${API_BASE_URL}/plants/batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(plants),
  })
  return response.json()
}

export async function updatePlant(
  id: string,
  plant: { status?: "HEALTHY" | "DISEASED" | "NEEDSATTENTION"; position?: number },
) {
  const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(plant),
  })
  return response.json()
}

// Actions API
export async function getActions() {
  const response = await fetch(`${API_BASE_URL}/actions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}

export async function getPossibleActions() {
  const response = await fetch(`${API_BASE_URL}/possible_actions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}

export async function getPlotActions(plotId: string) {
  const response = await fetch(`${API_BASE_URL}/plots/${plotId}/actions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}



export async function getRowActions(rowId: string) {
  const response = await fetch(`${API_BASE_URL}/plot_rows/${rowId}/actions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}



export async function getPlantActions(plantId: string) {
  const response = await fetch(`${API_BASE_URL}/plants/${plantId}/actions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}

export async function createAction(plantAction: { plotRowId?: string, plotId?: string, plantId?: string; possibleActionId: string, description?: string}) {
  const response = await fetch(`${API_BASE_URL}/actions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(plantAction),
  })
  return response.json()
}

// Species API
export async function getSpecies() {
  const response = await fetch(`${API_BASE_URL}/species`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
}
