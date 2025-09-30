export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Farm {
  id: string
  name: string
  location: string
  area: number
  createdAt: string
  updatedAt: string
  user_id: string
}

export interface Plot {
  id: string
  name: string
  area: number
  coordinates: string
  polygon: string
  createdAt: string
  updatedAt: string
  farm_id: string
}

export interface Row {
  id: string
  name: string
  length: number
  width: number
  createdAt: string
  updatedAt: string
  plot_id: string
}

export interface Species {
  id: string
  commonName: string
  scientificName: string
  createdAt: string
  updatedAt: string
}

export interface Plant {
  id: string
  identifier: string
  status: "HEALTHY" | "DISEASED" | "NEEDSATTENTION"
  position: number
  createdAt: string
  updatedAt: string
  plotRowId: string
  speciesId: string
    speciesCommonName: string
     speciesScientificName: string
}

export interface PossibleAction {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Action {
  id: string
  createdAt: string
  updatedAt: string
  possibleActionName: string
  possibleActionId: string
  plotRowId?: string
  plotId?: string
  plantId?: string
  description: string
}
