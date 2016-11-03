# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :video_call,
  ecto_repos: [VideoCall.Repo]

# Configures the endpoint
config :video_call, VideoCall.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "o4PXjvgwCxe79Yx8yLP3XzosEJdwtmxXNWY5eaL5aBqGWlQu3CTcjgsdaTLIr0ok",
  render_errors: [view: VideoCall.ErrorView, accepts: ~w(html json)],
  pubsub: [name: VideoCall.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
