import request from 'supertest';
import app from './app';

describe('GET /events/log', () => {
  it('should filter and sort log entries', async () => {
    const response = await request(app).get('/events/log?eventType=click_button');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.every((event: any) => event.eventType === 'click_button')).toBe(true);
    expect(response.body.every((event: any, index: number) => {
      if (index === 0) return true;
      return event.timestamp <= response.body[index - 1].timestamp;
    })).toBe(true);
  });

  it('should filter log entries by user ID and date range', async () => {
    const userId = 103;
    const fromDate = '2024-03-01';
    const toDate = '2024-03-02';
    const response = await request(app).get(`/events/log?userId=${userId}&fromDate=${fromDate}&toDate=${toDate}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.every((event: any) => event.userId === userId)).toBe(true);
    expect(response.body.every((event: any) => {
      const eventDate = new Date(event.timestamp);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return eventDate >= from && eventDate <= to;
    })).toBe(true);
  });
});