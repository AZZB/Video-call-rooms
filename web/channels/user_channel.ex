defmodule VideoCall.UserChannel do
  use VideoCall.Web, :channel

  def join("user:"<>user_id, _params, socket) do
    IO.puts "----------- user joined #{user_id}"
    {:ok, socket}
  end

  

end
