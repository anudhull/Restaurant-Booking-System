const restaurantService = require('../services/restaurantService');

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantService.getAllRestaurants();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurants', error });
    }
};

exports.searchRestaurants = async (req, res) => {
    const { searchTerm } = req.query;
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required.' });
    }
    try {
      const restaurants = await restaurantService.searchRestaurants(searchTerm);

      if (restaurants.length === 0) {
        return res.status(400).json({ message: 'No restaurants found' });
      }

      return res.status(200).json({ data: restaurants });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Error searching for restaurants.',
        error: error.message,
      });
    }
}

exports.getRestaurantDetails = async (req, res) => {
    const { id } = req.params;
  
    try {
      const restaurantDetails = await restaurantService.getRestaurantDetails(id);
  
      if (!restaurantDetails) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      res.status(200).json(restaurantDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching restaurant details', error: error.message });
    }
};