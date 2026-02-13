Steps to install : 
1. run ( make sure you have docker installed )
docker-compose build
docker-compose up -d

done

go ahead and see 
1. localhost:8080/wp-admin  , you need to intalize it once (dw i have used docker volumes , so even if you restart docker data persists)
2. localhost:3000          -- frotend 
mostly everything works, i.e. you can add posts through the wordpress and it will be visible in the frontend and also you can go and add pages in wordpress it would be visible 


you can also see tab of committee members in wordpress admin  you can add and see in the about of fronted , just make sure that you go and add a page named "About" through wordpress and done 
