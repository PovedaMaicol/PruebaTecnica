const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const jwt = require('jsonwebtoken')
const empresasRouter = require('express').Router()


const Empresa = require('../models/empresa')
const User = require('../models/user')
const Ticket = require('../models/ticket')
const Historia = require('../models/historia')

const middleware = require('../utils/middleware')
const {response, request} = require('express')
const { error } = require('../utils/logger')
const ticket = require('../models/ticket')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }



// obtener empresas
empresasRouter.get('/', async (request, response) => {
    const empresas = await Empresa.find({}).populate('user', { username: 1, name: 1 })
    response.json(empresas)
})


// obtener empresa por id
// obtener empresa por id
empresasRouter.get('/:id', async (request, response) => {
    try {
        const empresa = await Empresa.findById(request.params.id)
            .populate({
                path: 'historias', // Población de historias
                populate: {
                    path: 'tickets', // Población de tickets dentro de cada historia
                }
            });

        if (empresa) {
            response.json(empresa);
        } else {
            response.status(404).json({ error: 'Empresa no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la empresa:', error); // Aquí puedes ver el detalle del error
        response.status(500).json({ error: 'Error interno del servidor' });
    }
});



// añadir empresa
empresasRouter.post('/', middleware.userExtractor, async (request, response) => {
    
    try {
        const {name, city} = request.body

        if (!name || !city) {
            return response.status(400).json({ error: 'name and city are required' })
        }
        const user = request.user;
        console.log('el user es', user)

        if(!user) {
            return response.status(401).json({ error: 'token missing or invalid'})
        }
        const empresa = new Empresa({
            name: name,
            city: city,
            user: user._id
        })  

        const savedEmpresa = await empresa.save()
        user.empresas = user.empresas.concat(savedEmpresa._id)
        await user.save()
        response.status(201).json(savedEmpresa)
    } catch (error) {
        console.error(error)
        response.status(500).json({ error: 'something went wrong' })
    
   
    }
})

// editar empresa
empresasRouter.put('/:id', middleware.userExtractor, async (request, response) => {
    const empresaId = request.params.id;
    const { name, city } = request.body;

    console.log('Empresa ID:', empresaId);
    console.log('Datos recibidos:', { name, city });

    if (!name || !city) {
        return response.status(400).json({ error: 'Name and city are required' });
    }

    try {
        // Buscar la empresa
        const empresa = await Empresa.findById(empresaId);
        console.log('Empresa encontrada:', empresa);

        if (!empresa) {
            return response.status(404).json({ error: 'Empresa not found' });
        }

        // Verificar que el usuario esté autenticado y que la empresa tenga un propietario
        const user = request.user;
        console.log('Usuario autenticado:', user);

        if (!user) {
            return response.status(401).json({ error: 'token missing or invalid' });
        }

        if (!empresa.user) {
            return response.status(404).json({ error: 'Empresa does not have a user associated' });
        }

        // Verificar si el usuario es el propietario de la empresa
        if (empresa.user.toString() !== user.id.toString()) {
            return response.status(403).json({ error: 'Forbidden' });
        }

        // Actualizar los campos de la empresa
        empresa.name = name;
        empresa.city = city;

        const updatedEmpresa = await empresa.save();
        response.status(200).json(updatedEmpresa);
    } catch (error) {
        console.error('Error al actualizar la empresa:', error);
        response.status(500).json({ error: 'An error occurred while updating the empresa' });
    }
});


// eliminar empresa
empresasRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

    try {
        const user = request.user;
        const empresaId = request.params.id

        console.log('el user es', user)
        console.log('la empresa es', empresaId)

        if(!empresaId) {
            return response.status(400).json({ error: 'empresaId is required' })
        }

        const empresa = await Empresa.findById(empresaId)
        if(!empresa) {
            return response.status(404).json({ error: 'empresa not found' })
        }
        if(!user) {
            return response.status(401).json({ error: 'token missing or invalid'})
        }

          // valido si el usuario es propietario del blog
        if(empresa.user.toString() !== user.id.toString()){
        return response.status(403).json({ error: 'forbidden' });
        }

        // eliminar la empresa
        await Empresa.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch {
        console.error(error);
        response.status(500).json({ error: 'An error occurred while deleting the empresa' })
    }
    
})






// agregar historia
empresasRouter.post('/:empresaId/historias', async (request, response) => {
    const { empresaId } = request.params;
    const { activity, tickets } = request.body;

    if (!activity) {
        return response.status(400).json({ error: 'Activity is required'});
    }

    if (!Array.isArray(tickets) || tickets.some(ticket => typeof ticket !== 'string')) {
        return response.status(400).json({ error: 'Tickets must be an array of strings' });
      }

    try {
        //verificar si la empresa existe
        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
            return response.status(404).json({ error: 'empresa not found'})
        }

        // Crear la nueva historia
        const newHistoria = new Historia({
        activity,
        empresaID: empresaId,
        tickets
        });

        const savedHistoria = await newHistoria.save();

        // Actualizar el array de historias en la empresa
        empresa.historias = empresa.historias.concat(savedHistoria._id);
        await empresa.save();
        response.status(201).json(savedHistoria);

        } catch (error) {
        console.error('Error adding historia:', error);
        response.status(500).json({ error: 'An error occurred while adding the historia' });
        
        }


})


// Obtener historia completa (con los tickets)
empresasRouter.get('/:empresaId/historias/:historiaId', async (request, response) => {
    const { empresaId, historiaId } = request.params;

    try {
        // Verificar si la empresa existe
        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
            return response.status(404).json({ error: 'Empresa not found' });
        }

        // Verificar si la historia existe y obtenerla junto con los tickets
        const historia = await Historia.findById(historiaId)

        if (!historia) {
            return response.status(404).json({ error: 'Historia not found' });
        }

        // Verificar si la historia pertenece a la empresa
        if (historia.empresaID.toString() !== empresaId) {
            return response.status(400).json({ error: 'Historia does not belong to this empresa' });
        }

        // Responder con la historia completa (con los tickets)
        response.status(200).json(historia);

    } catch (error) {
        console.error('Error getting historia:', error);
        response.status(500).json({ error: 'An error occurred while fetching the historia' });
    }
});

// Editar historia
empresasRouter.put('/:empresaId/historias/:historiaId', async (request, response) => {
    const { empresaId, historiaId } = request.params;
    const { activity } = request.body;

    if (!activity) {
        return response.status(400).json({ error: 'Activity is required' });
    }

    try {
        // Verificar si la empresa existe
        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
            return response.status(404).json({ error: 'Empresa not found' });
        }

        // Verificar si la historia existe
        const historia = await Historia.findById(historiaId);
        if (!historia) {
            return response.status(404).json({ error: 'Historia not found' });
        }

        // Verificar si la historia pertenece a la empresa
        if (historia.empresaID.toString() !== empresaId) {
            return response.status(400).json({ error: 'Historia does not belong to this empresa' });
        }

        // Actualizar los campos de la historia
        historia.activity = activity;

        const updatedHistoria = await historia.save();
        response.status(200).json(updatedHistoria);
    } catch (error) {
        console.error('Error updating historia:', error);
        response.status(500).json({ error: 'An error occurred while updating the historia' });
    }
});



// Eliminar una historia
empresasRouter.delete('/:empresaId/historias/:historiaId', async (request, response) => {
    const { empresaId, historiaId } = request.params;

    try {
        // Verificar si la empresa existe
        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
            return response.status(404).json({ error: 'Empresa not found' });
        }

        // Verificar si la historia existe
        const historia = await Historia.findById(historiaId);
        if (!historia) {
            return response.status(404).json({ error: 'Historia not found' });
        }

        // Verificar si la historia pertenece a la empresa
        if (historia.empresaID.toString() !== empresaId) {
            return response.status(400).json({ error: 'Historia does not belong to this empresa' });
        }

        // Eliminar la historia de la colección
        await Historia.findByIdAndDelete(historiaId);

        // Eliminar la referencia de la historia en la empresa
        empresa.historias = empresa.historias.filter(h => h.toString() !== historiaId);
        await empresa.save();

        response.status(204).end();
    } catch (error) {
        console.error('Error deleting historia:', error);
        response.status(500).json({ error: 'An error occurred while deleting the historia' });
    }
});





















// Crear un nuevo ticket
empresasRouter.post('/:empresaId/historias/:historiaId/tickets', async (request, response) => {
    const { empresaId, historiaId } = request.params;
    const { titulo, descripcion, estado } = request.body;

    if (!titulo) {
        return response.status(400).json({ error: 'Titulo es requerido' });
    }

    try {
        // Verificar si la historia existe y pertenece a la empresa
        const historia = await Historia.findById(historiaId);
        if (!historia || historia.empresaID.toString() !== empresaId) {
            return response.status(404).json({ error: 'Historia no encontrada para esta empresa' });
        }

        // Crear el nuevo ticket
        const newTicket = new Ticket({
            titulo,
            descripcion,
            estado,
            historiaID: historiaId,
            historial: [{ estado: estado || 'activo' }] // Historial inicial del ticket
        });

        const savedTicket = await newTicket.save();

        // Agregar el ticket a la lista de tickets de la historia
        historia.tickets = historia.tickets.concat(savedTicket._id);
        await historia.save();

        response.status(201).json(savedTicket);
    } catch (error) {
        console.error('Error al crear el ticket:', error);
        response.status(500).json({ error: 'Error al crear el ticket' });
    }
});


// Editar ticket
empresasRouter.put('/:empresaId/tickets/:ticketId', async (request, response) => {
    const { empresaId, ticketId } = request.params;
    const { titulo, descripcion, estado } = request.body;

    try {
        const empresa = await Empresa.findById(empresaId).populate('tickets');

        if (!empresa) {
            return response.status(404).json({ error: 'Empresa not found'});
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return response.status(404).json({ error: 'Ticket not found'})
        }

        // Actualizar los campos del ticket
        if (titulo) ticket.titulo = titulo;
        if (descripcion) ticket.descripcion = descripcion;
        if (estado) {
        ticket.estado = estado;
        ticket.historial.push({ estado }); // Registrar el cambio de estado
        }

        const updatedTicket = await ticket.save();
        response.status(200).json(updatedTicket)
        } catch (error) {
        console.error('Error updating ticket:', error);
        response.status(500).json({ error: 'An error occurred while updating the ticket' });
    }
})


// Eliminar un ticket
empresasRouter.delete('/:empresaId/tickets/:ticketId', async (request, response) => {
    const { empresaId, ticketId } = request.params;

        try {
        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
        return response.status(404).json({ error: 'Empresa not found' });
        }
  
        // Eliminar el ticket de la colección y de la lista de la empresa
        await Ticket.findByIdAndDelete(ticketId);
        empresa.tickets = empresa.tickets.filter(t => t.toString() !== ticketId);
        await empresa.save();
  
        response.status(204).end();
        } catch (error) {
        console.error('Error deleting ticket:', error);
        response.status(500).json({ error: 'An error occurred while deleting the ticket' });
    }
  });
  
module.exports = empresasRouter