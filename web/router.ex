defmodule VideoCall.Router do
  use VideoCall.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", VideoCall do
    pipe_through :browser # Use the default browser stack

    get "/", CallController, :index
    resources "/rooms", RoomController, only: [:index, :show, :new, :create, :delete]
  end

  # Other scopes may use custom stacks.
  # scope "/api", VideoCall do
  #   pipe_through :api
  # end
end
