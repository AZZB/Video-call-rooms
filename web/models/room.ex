defmodule VideoCall.Room do
  use VideoCall.Web, :model

  schema "rooms" do
    field :name, :string
    field :flag, :string
    field :user, :string

    timestamps
  end

  @require_fields ~w( name flag user)
  @optional_fields ~w()

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @require_fields, @optional_fields)
    |> validate_length(:name, min: 3, max: 20)
    |> unique_constraint(:name)
  end
end
