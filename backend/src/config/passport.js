const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { User } = require('../models');
const logger = require('../utils/logger');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    logger.error('Error deserializing user:', error);
    done(error, null);
  }
});

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/api/auth/github/callback',
        scope: ['user:email', 'repo', 'read:org']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find or create user
          let user = await User.findOne({
            where: { github_id: profile.id }
          });

          if (!user) {
            // Create new user
            user = await User.create({
              github_id: profile.id,
              username: profile.username,
              email: profile.emails?.[0]?.value || null,
              avatar_url: profile.photos?.[0]?.value || null,
              github_access_token: accessToken,
              profile_data: {
                name: profile.displayName,
                bio: profile._json.bio,
                location: profile._json.location,
                company: profile._json.company,
                blog: profile._json.blog,
                public_repos: profile._json.public_repos,
                followers: profile._json.followers,
                following: profile._json.following
              }
            });
            logger.info(`New user created: ${user.username}`);
          } else {
            // Update existing user
            await user.update({
              github_access_token: accessToken,
              avatar_url: profile.photos?.[0]?.value || user.avatar_url,
              email: profile.emails?.[0]?.value || user.email,
              profile_data: {
                ...user.profile_data,
                name: profile.displayName,
                bio: profile._json.bio,
                location: profile._json.location,
                company: profile._json.company,
                blog: profile._json.blog,
                public_repos: profile._json.public_repos,
                followers: profile._json.followers,
                following: profile._json.following
              }
            });
            logger.info(`User updated: ${user.username}`);
          }

          return done(null, user);
        } catch (error) {
          logger.error('GitHub OAuth error:', error);
          return done(error, null);
        }
      }
    )
  );
} else {
  logger.warn('GitHub OAuth not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env');
}

module.exports = passport;
