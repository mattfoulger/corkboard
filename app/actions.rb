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

