# How to Use This Backend API

1. **Setup Instructions**:
   - Copy all the files to your project directory
   - Run `npm install` to install dependencies
   - Create a `.env` file with the provided template
   - Start the server with `npm start` or `npm run dev` for development

2. **Key Features**:
   - Complete implementation of all Aniwatch API endpoints
   - Rate limiting to prevent abuse
   - Error handling and logging
   - Clean architecture with service-controller pattern
   - CORS enabled for cross-origin requests
   - Security headers with Helmet

3. **API Endpoints**:
   - **Home Page**: `/api/home`
   - **A-Z List**: `/api/azlist/:sortOption?page=1`
   - **Anime Qtip**: `/api/qtip/:animeId`
   - **Anime Info**: `/api/anime/:animeId`
   - **Search**: `/api/search?q=query&page=1`
   - **Advanced Search**: `/api/advanced-search` with multiple parameters
   - **Search Suggestions**: `/api/search/suggestion?q=query`
   - **Producer Animes**: `/api/producer/:name?page=1`
   - **Genre Animes**: `/api/genre/:name?page=1`
   - **Category Animes**: `/api/category/:category?page=1`
   - **Schedules**: `/api/schedule?date=yyyy-mm-dd`
   - **Anime Episodes**: `/api/anime/:animeId/episodes`
   - **Episode Servers**: `/api/episode/servers?animeEpisodeId=id`
   - **Episode Sources**: `/api/episode/sources?animeEpisodeId=id&server=server&category=category`

The API provides complete access to all the features mentioned in the documentation, with a clean architecture that makes it easy to maintain and extend.