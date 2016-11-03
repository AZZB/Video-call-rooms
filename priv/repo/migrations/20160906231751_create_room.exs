defmodule VideoCall.Repo.Migrations.CreateRoom do
  use Ecto.Migration

  def change do
    create table(:rooms) do
      add :name, :string, null: false
      add :flag, :string
      add :user, :string

      timestamps
    end
    create unique_index(:rooms, [:name])
  end
end
