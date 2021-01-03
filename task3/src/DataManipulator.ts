import { ServerRespond } from './DataStreamer';

// Set interface for our returnd row object
// Our row must include all the necessary values in the table (based on the schema) 
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    // Determine prices depending on server response
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;

    // Calculate ratio
    const ratio = priceABC / priceDEF;

    // Define bounds
    const upperBound = 1.1;
    const lowerBound = 0.9;

    // Return a row object
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ? serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    }
  }
}
