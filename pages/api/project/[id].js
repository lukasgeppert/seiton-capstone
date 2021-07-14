/* eslint-disable import/no-anonymous-default-export */
import prisma from '../../../prisma/prisma'
import { getSession } from 'next-auth/client'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    res.status(403).json({
      message: 'You must be signed in to view this page.'
    })
  } else {
    // 📡 GET /api/project/1
    if (req.method === 'GET') {
      try {
        const { id } = req.query
        const result = await prisma.project.findUnique({
          where: { id: Number(id) },
          include: {
            columns: {
              orderBy: { index: 'asc' },
              include: {
                tasks: {
                  orderBy: { index: 'asc' },
                  include: {
                    comments: {
                      orderBy: { createdAt: 'asc' },
                      include: {
                        user: true
                      }
                    }
                  }
                }
              }
            }
          }
        })

        res.status(200).json(result)
      } catch (error) {
        console.error(error) // Which one is idiomatic?
        throw new Error('Error getting project')
      }
    }

    // PUT api/project/1
    if (req.method === 'PUT') {
      try {
        const { name, orgId } = req.body
        const { id } = req.query
        const result = await prisma.project.update({
          where: { id: id },
          data: { name, orgId }
        })

        res.status(200).json(result)
      } catch (error) {
        console.log('error in the project id api call!', error)
      }
    }

    if (req.method === 'DELETE') {
      try {
        const id = Number(req.query.id)
        const deleteProject = await prisma.project.delete({
          where: {
            id: id
          }
        })

        const deleteUserProject = await prisma.userProject.deleteMany({
          where: {
            projectId: id
          }
        })

        const transaction = await prisma.$transaction([
          deleteProject,
          deleteUserProject
        ])

        res.status(200).json(deleteProject)
      } catch (error) {
        console.log('error in the delete project id api call!', error)
      }
    }
  }
}
