import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    userId: "",
  })
  .actions((store) => ({
    setUserId(userId: string) {
      store.userId = userId
    },
    leaveChatRoom() {
      store.userId = ""
    },
  }))

export interface ChatStore extends Instance<typeof ChatStoreModel> {}
export interface ChatStoreSnapshot extends SnapshotOut<typeof ChatStoreModel> {}
