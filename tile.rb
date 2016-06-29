class Tile

  attr_reader :type, :revealed, :flagged

  def initialize
    @type = 0
    @revealed = false
    @flagged = false
  end

  def change_type(new_type)
    @type = new_type
  end

  def reveal
    @revealed = true
    @flagged = false
    type
  end

  def revealed?
    revealed
  end

  def flag_as_bomb
    @flagged = true
  end
end
