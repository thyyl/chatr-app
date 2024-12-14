import { LocalLoginResponse } from "@/services/schema"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    name: "",
    sid: types.maybe(types.string),
    userId: "",
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.sid
    },
    get isConnected() {
      return !!store.authToken
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setName(value: string) {
      store.name = value
    },
    login(value: LocalLoginResponse) {
      store.name = value.name
      store.sid = value.sid
      store.userId = value.id
    },
    logout() {
      store.authToken = undefined
      store.name = ""
      store.sid = undefined
      store.userId = ""
    },
    leaveRoom() {
      store.authToken = undefined
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
