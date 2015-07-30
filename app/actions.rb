# Homepage (Root path)
get '/' do
  erb :index
end


get '/boards/:id' do
  @pins = Board.find(params[:id]).pins.reverse_order
  @pins.to_json
end

get '/boards' do
  @boards = Board.all
  @boards.to_json
end

post '/boards' do
  @board = Board.new
  @board.name = params[:name]
  @board.description = params[:description]
  @board.save.to_json
end

get '/pins/:id' do
  @pin = Pin.find(params[:id])
  @pin.to_json
end

get '/pins' do
  @pins = Pin.all.reverse_order
  @pins.to_json
end

post '/pins' do
  @pin = Pin.new
  @pin.name = params[:name]
  @pin.description = params[:description]
  @pin.board_id = params[:board_id]
  @pin.url = params[:url]
  @pin.save!
  @pin.to_json
end

put '/pins' do
  if params[:pk]
    @pin = Pin.find(params[:pk])
    field = params[:name]
    value = params[:value]
    case field
    when "description"
      @pin.description = value
    when "board_id"
      @pin.board_id = value
    when "name"
      @pin.name = value
    when "url"
      @pin.url = value
    end
    @pin.save!
    return @pin.to_json
  end

  @pin = Pin.find(params[:id])
  @pin.name = params[:name]
  @pin.description = params[:description]
  @pin.board_id = params[:board_id]
  @pin.url = params[:url]
  @pin.save!
  @pin.to_json
end

