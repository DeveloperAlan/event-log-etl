import express from 'express';
import * as path from 'path';
import * as fs from 'fs';

const router = express.Router();

type Event = {
  timestamp: Date;
  userId: number;
  eventType: string;
  originalLine: string;
};

router.get('/log', async (req, res) => {
  const logFilePath = path.join(__dirname, '../data/events.log');

  try {
    const fileContent = await fs.promises.readFile(logFilePath, 'utf-8');
    const events: Event[] = fileContent
      .trim()
      .split('\n')
      .map((line) => {
        const [timestampStr, eventStr] = line.split(' - ');
        const [userId, eventDetail] = eventStr.split(' Event: ');
        const [eventType] = eventDetail.split('_');

        return {
          timestamp: new Date(timestampStr),
          userId: parseInt(userId.slice(5), 10),
          eventType,
          originalLine: line,
        };
      });

    // Filter events based on search variables
    const { userId, eventType, fromDate, toDate } = req.query;
    let filteredEvents = events;

    if (userId) {
      filteredEvents = filteredEvents.filter((event) => event.userId === parseInt(userId as string, 10));
    }

    if (eventType) {
      filteredEvents = filteredEvents.filter((event) => event.eventType === eventType);
    }

    if (fromDate) {
      const from = new Date(fromDate as string);
      filteredEvents = filteredEvents.filter((event) => event.timestamp >= from);
    }

    if (toDate) {
      const to = new Date(toDate as string);
      filteredEvents = filteredEvents.filter((event) => event.timestamp <= to);
    }

    // Sort events by timestamp in descending order
    filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    res.json(filteredEvents);
  } catch (err) {
    console.error('Error reading log file:', err);
    res.status(500).json({ error: 'Failed to read log file' });
  }
});

export default router;
