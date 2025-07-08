const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "clickstream",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();
producer.connect();

module.exports = async (data) => {
  await producer.send({
    topic: "clicks",
    messages: [{ value: JSON.stringify(data) }],
  });
};
