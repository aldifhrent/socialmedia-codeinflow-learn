"use server"

import prisma from "@/lib/prisma";
import { updateProfileSchema, UpdateUserProfileValues } from "@/lib/validation";
import { validateRequest } from "@/auth";
import { getUserDataSelect } from "@/lib/types";


export async function updateUserProfile(values: UpdateUserProfileValues) {
    const validatedValues = updateProfileSchema.parse(values);

    const { user } = await validateRequest()

    if(!user) throw new Error("Unauthorizd");

    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: validatedValues,
        select: getUserDataSelect(user.id)
    })

    return updatedUser
}