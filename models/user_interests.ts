import { model, models, Schema } from "mongoose"

export type TUserInterests = {
    user: any,
    interests: {
        interestID: string,
        weight: number
    }[]
}

const userInterestsSchema = new Schema<TUserInterests>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        unique: true
    },
    interests: [
        new Schema<TUserInterests["interests"][number]>({
            interestID: {
                type: String,
                required: true
            },
            weight: {
                type: Number,
                default: 1
            }
        }, { _id: false })
    ]
})
const userInterestsModel = models.user_interests || model("user_interests", userInterestsSchema)

export { userInterestsModel }
