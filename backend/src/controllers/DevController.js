const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const getLocation = require('../utils/getLocation');

module.exports = {

  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async show(request, response) {
    const { github_username } = request.params;

    const dev = await Dev.findOne({ github_username })

    return response.json(dev);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    try {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
      /* If name doesn't exists, the default value for it will be the login variable. */
      const { name = login, avatar_url, bio } = apiResponse.data;
    
      const techsArray = parseStringAsArray(techs);
    
      const location = getLocation(latitude, longitude);
    
      const newDev = await Dev.create({
        name,
        github_username,
        bio,
        avatar_url,
        techs: techsArray,
        location
      });
    
      return response.json({
        message: 'New user added successfully!',
        newDev
      });
    } catch (error) {
      return response.json({
        message: 'Cannot add new dev.',
        cause: error
      });
    }
  },

  async update(request, response) {
    const { id } = request.params;

    let dev = await Dev.findById(id);

    if (!dev) {
      return response.json({
        message: 'Cannot update dev.',
        cause: 'Dev not found'
      });
    }

    try {
      const { name, bio, avatar_url, techs, latitude, longitude } = request.body;

      const techsArray = parseStringAsArray(techs);
  
      const location = getLocation(latitude, longitude);
  
      dev.name = name === undefined ? dev.name : name;
      dev.bio = bio === undefined ? dev.bio : bio;
      dev.avatar_url = avatar_url === undefined ? dev.avatar_url : avatar_url;
      dev.techs = techs === undefined ? dev.techs : techsArray;
      dev.location = location === undefined ? dev.location : location;
  
      await dev.save();
  
      return response.json({
        message: 'Dev updated successfully!',
        dev
      });
    } catch (error) {
      return response.json({
        message: 'Cannot update dev.',
        cause: error
      });
    }
  },

  async destroy(request, response) {
    const { id } = request.params;

    const dev = await Dev.findById(id);

    if (!dev) {
      return response.json({
        message: 'Cannot delete dev.',
        cause: 'Dev not found'
      });
    }

    await dev.remove();

    return response.json({ message: 'Dev deleted successfully.'});
  }

};
