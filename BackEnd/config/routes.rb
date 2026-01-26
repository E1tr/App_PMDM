Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      # Auth
      post '/auth/login', to: 'auth#login'
      post '/auth/register', to: 'auth#register'
      get '/auth/me', to: 'auth#me'
      
      # Roles
      resources :roles, only: [:index, :show]
      
      # Users
      resources :users
      
      # Clientes
      resources :clientes do
        get 'pedidos', on: :member
        resources :direcciones, controller: 'direcciones_cliente'
      end
      
      # Productos
      resources :productos do
        resources :tallas, controller: 'tallas_producto'
      end
      
      # Pedidos
      resources :pedidos do
        resources :lineas, controller: 'lineas_pedido' do
          resources :tallas_linea, controller: 'tallas_linea_pedido', only: [:index, :create, :destroy]
        end
        get 'historial', on: :member
        post 'cambiar_estado', on: :member
      end
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
