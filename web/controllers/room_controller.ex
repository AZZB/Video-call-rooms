defmodule VideoCall.RoomController do
  use VideoCall.Web, :controller
  alias VideoCall.Room

  def index(conn, _params) do
    rooms = Repo.all(Room)
    render conn, "index.html", rooms: rooms
  end

  def show(conn, %{"id" => id}) do
    room = Repo.get!(Room, id)
    room = doJoiner(conn, room) || room
    render conn, "show.html", room: room
  end

  def new(conn, _params) do
    changeset = Room.changeset(%Room{})
    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"room" => room_params}) do
    room_params =
      room_params
      |> Map.put("flag", "free")
      |> Map.put("user", "Azz")

    changeset = Room.changeset(%Room{}, room_params)
    case Repo.insert(changeset) do
      {:ok, room} ->
        VideoCall.Endpoint.broadcast!("room:public", "new:room", %{
            id: room.id,
            name: room.name,
            flag: room.flag,
            user: room.user
          })
        conn
        |> put_flash(:info, "room  created with name #{room.name} ")
        |> redirect(to: room_path(conn, :show, room))
      {:error, changeset} ->
        render conn, "new.html", changeset: changeset
    end
  end


  def delete(conn, %{"id" => id}) do
    room = Repo.get!(Room, id)
    Repo.delete!(room)
    conn
    |> put_flash(:info, "room deleted!")
    |> redirect(to: room_path(conn, :index))
  end

  defp doJoiner(conn, room) do
    if(conn.params["joiner"] == "true") do
      changeset = Room.changeset(room, %{flag: "full"})
      {:ok , new_room } = Repo.update(changeset)
    end
    new_room
  end


end
