import { response, request } from "express";
import { prismaClient, prismaRole, prismaRoleClient } from "../../db";
import { encrypt } from "../../helpers/handleBcrypt";
import { ROLES } from "../interfaces/client.interfaces";

export const getAllClients = async(req = request, res = response) => {

    try {
        const clients = await prismaClient.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                createdAt: true,
                state: true,
                phoneNumber: true,
                roles: {
                    select:{
                        role: {
                            select:{
                                role: true
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json({
            ok: true,
            clients: clients.map(client => ({...client, roles: client.roles.map(role => role.role.role)}))
        })
        
    } catch (error) {
          res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        })
    }

}

export const getClientById = (req = request, res = response) => {
    res.status(200).json({
        ok: true,
        cards: ["client one", "client two"]
    })
}

export const createClient = async(req = request, res = response) => {
    
    const {
        name, 
        email, 
        password, 
        phoneNumber} = req.body;
    

    try {
        const clientDB  = await prismaClient.findFirst({
            where: { email }
        })

        if(clientDB){
            return res.status(400).json({
                ok: false,
                msg: "El correo ya se encuentra registrado"
            })
        }

        // Esto es para determinar a quien se le coloca el rol de admin
        const role = email.toLowerCase().includes("admin")? ROLES.admin : ROLES.user;

        const passwordEncrypted = await encrypt( password );

        const clientCreated = await prismaClient.create({
            data: {
                name,
                email,
                state: true,
                password: passwordEncrypted,
                phoneNumber,

            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                createdAt: true,
                state: true,
                phoneNumber: true,
                roles: {
                    select:{
                        role: {
                            select:{
                                role: true
                            }
                        }
                    }
                }
            }
        })

        const roleId = (await prismaRole.findFirst({ where: {role} }))!.id
        const clientId = clientCreated.id;

        await prismaRoleClient.create({
            data: { clientId, roleId }
        })
    
        return res.status(200).json({
            ok: true,
            msg: "El cliente ha sido creado satisfactoriamente!",
            client: {
                ...clientCreated,
                roles: clientCreated.roles.map(role => role.role.role)
            }
        });

        
    } catch (error) {
        console.log( error)
        return res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        })
    }
    
}

export const updateClient = (req = request, res = response) => {
    res.status(200).json({
        ok: true,
        cards: "client updated"
    })
}

export const deleteClient = (req = request, res = response) => {
    res.status(200).json({
        ok: true,
        cards: "client deleted"
    })
}