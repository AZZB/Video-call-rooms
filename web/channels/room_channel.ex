defmodule VideoCall.RoomChannel do
  use VideoCall.Web, :channel
  alias Phoenix.Socket.Broadcast

  def join("room:public", _params, socket) do
    {:ok, socket}
  end

  def join("room:"<>room_id, _params, socket) do
    IO.puts "room subscribe from #{room_id}"
    {:ok, assign(socket, :room_id, room_id)}
  end

  def handle_in("message", %{"body" => body}, socket) do
    broadcast! socket, "message", %{"body" => body}
    {:noreply, socket}
  end

  def handle_in("close", %{"isJoiner" => isJoiner}, socket) do
    IO.puts "is joiner: #{isJoiner}"
    {:noreply, socket}
  end

end
