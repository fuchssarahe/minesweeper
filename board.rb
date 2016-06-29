require 'tile'

class board

  attr_reader :grid, :game_over

  def initialize
    @grid = Array.new(9) { Array.new(9, Tile.new) }
    @game_over = false
  end

  def [](pos)
    row, col = pos
    @grid[row][col]
  end

  def [](pos, value)
    row, col = pos
    @grid[row][col] = value
  end

  def populate_board(bombs = 18)
    bomb_arr = populate_bombs(bombs)
    bomb_arr.each { |pos| add_num(pos) }
  end

  def size
    grid.length
  end

  def add_num(pos)
    check_boundaries do  |i, j|
      new_pos = [pos[0]+i, pos[1]+j]
      if on_board?(new_pos)
        board[new_pos] += 1
      end
    end

  end

  def check_boundaries(&prc)
    boundaries = (-1..1).to_a

    boundaries.each do |i|
      boundaries.each do |j|
        prc.call(i, j)
      end
    end
  end

  def on_board?(pos)
    row, col = pos
    row.between?(0, size) && col.between?(0, size)
  end

  def populate_bombs(bombs)
    until positions.length == bombs
      pos = [rand(8), rand(8)]
      positions << pos unless positions.include?(pos)
    end
    positions.each do |pos|
      place_bomb(pos)
    end
    positions
  end

  def place_bomb(pos)
    self[pos].change_type(:bomb)
  end

  def reveal_tile(pos)
    val = self[pos].reveal

    if (val == 0)
      revealer([pos])
    elsif (val == :bomb)
      @game_over = true
    end
  end

  def revealer(pos)
    check_boundaries do |i, j|
      new_pos = [ pos[0] + i, pos[1] + j ]
      if on_board?(new_pos) && board[pos].reveal == 0
        reveal_tile(new_pos)
      end
    end
  end
end
