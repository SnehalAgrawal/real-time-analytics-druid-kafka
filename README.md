# Clickstream Analytics Example

This project demonstrates a real-time clickstream analytics system using:

- Node.js (Express) for ingesting click events into Kafka
- Apache Kafka for event streaming
- Apache Druid for real-time ingestion and analytics
- A simple HTML page for visualization

## Getting Started

1. Project Structure

   ```
   clickstream-realtime/
   ├── docker-compose.yml
   ├── druid/
   │   └── kafka-supervisor.json
   ├── node-server/
   │   ├── index.js
   │   ├── producer.js
   │   ├── query.js
   │   └── views/index.html

   ```

2. Launch Kafka & Druid:

   ```bash
   cd infra
   docker-compose up -d
   ```

   \*\* Druid middlemanager service takes huge memory, if you are running on local machine please increase the memory to 8 GB atleast

   Test with Kafka CLI

   ```bash
   # Get into container
   docker exec -it <kafka_container_id_or_name> bash

   # Create topic
   kafka-topics --create --topic test --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

   # List topics
   kafka-topics --list --bootstrap-server localhost:9092

   # Start producer
   kafka-console-producer --topic test --bootstrap-server localhost:9092

   # Start consumer
   kafka-console-consumer --topic test --bootstrap-server localhost:9092 --from-beginning
   ```

3. Kafka Topic Creation

   ```bash
   docker exec -it <kafka_container_id> kafka-topics --create --topic clicks --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
   ```

4. Druid Kafka Ingestion Spec
   Start Druid Kafka ingestion by posting the supervisor spec

   ```bash
   curl -X POST http://localhost:8888/druid/indexer/v1/supervisor \
   -H 'Content-Type: application/json' \
   -d @kafka-supervisor.json
   ```

   Checks the status of the clickstream supervisor

   ```bash
   curl http://localhost:8081/druid/indexer/v1/supervisor/clickstream/status
   ```

5. Install Node dependencies and start the server:

   ```bash
   npm install
   npm run index.js
   ```

6. Start Druid Kafka ingestion by posting the supervisor spec:

   ```bash
   curl -X POST http://localhost:3000/click \
   -H "Content-Type: application/json" \
   -d '{"userId": "u123", "page": "/home"}'
   ```

7. To see the results open

   ```
   http://localhost:3000/
   ```

## Testing

Send a click event:

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"userId":"user1","page":"/home"}' \
http://localhost:3000/click
```

The dashboard will update every 5 seconds with top pages by view count.

## Direct SQL Query

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"query":"SELECT page, COUNT(*) as views FROM clickstream GROUP BY page ORDER BY views DESC LIMIT 10"}' \
  http://localhost:8888/druid/v2/sql
```
