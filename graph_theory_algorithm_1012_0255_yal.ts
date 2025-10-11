// 代码生成时间: 2025-10-12 02:55:32
import { PrismaClient } from '@prisma/client';

// Ensure a single instance of the PrismaClient is used globally.
const prisma = new PrismaClient();

/**
 * Represents a basic graph structure.
 * @interface Graph
 */
interface Graph {
  nodes: Record<string, Node>;
  edges: Edge[];
}

/**
 * Represents a node in the graph.
 * @interface Node
 */
interface Node {
  id: string;
  data?: any;
}

/**
 * Represents an edge in the graph.
 * @interface Edge
 */
interface Edge {
  from: string;
  to: string;
  weight?: number;
}

/**
 * A class for graph theory algorithms.
 * @class GraphAlgorithms
 */
export class GraphAlgorithms {

  private graph: Graph;

  /**
   * Constructs a new instance of GraphAlgorithms with an empty graph.
   * @param graph The graph instance.
   */
  constructor(graph: Graph) {
    this.graph = graph;
  }

  /**
   * Adds a node to the graph.
   * @param id The unique identifier of the node.
   * @param data Optional data associated with the node.
   */
  addNode(id: string, data?: any): void {
    if (this.graph.nodes[id]) {
      throw new Error("You cannot add a node with the same id twice.");
    }
    this.graph.nodes[id] = { id, data };
  }

  /**
   * Adds an edge to the graph.
   * @param from The id of the node from which the edge starts.
   * @param to The id of the node to which the edge points.
   * @param weight The weight of the edge.
   */
  addEdge(from: string, to: string, weight?: number): void {
    if (!this.graph.nodes[from] || !this.graph.nodes[to]) {
      throw new Error("Both nodes must exist before adding an edge between them.");
    }
    this.graph.edges.push({ from, to, weight });
  }

  /**
   * Finds the shortest path between two nodes using Dijkstra's algorithm.
   * @param startId The id of the starting node.
   * @param endId The id of the ending node.
   * @returns An array of node ids representing the shortest path.
   */
  dijkstra(startId: string, endId: string): string[] | null {
    const distances = Object.fromEntries(Object.keys(this.graph.nodes).map(
      id => [id, id === startId ? 0 : Infinity]
    ));
    const previous = {};
    const unvisited = [...Object.keys(this.graph.nodes)];

    while (unvisited.length) {
      const current = unvisited.reduce((
        best, nodeId
      ) => distances[best] < distances[nodeId] ? best : nodeId, unvisited[0]);
      unvisited.splice(unvisited.indexOf(current), 1);

      if (current === endId) {
        return this.buildPath(previous, endId);
      }

      this.graph.edges.forEach(edge => {
        if (edge.from === current && unvisited.includes(edge.to)) {
          const nextDistance = distances[current] + edge.weight || 1;
          if (nextDistance < distances[edge.to]) {
            distances[edge.to] = nextDistance;
            previous[edge.to] = current;
          }
        }
      });
    }

    return null; // No path found.
  }

  /**
   * Builds the shortest path from the start node to the end node based on the 'previous' node map.
   * @param previous A map from node id to the previous node in the shortest path.
   * @param endId The id of the ending node.
   * @returns An array of node ids representing the shortest path.
   */
  private buildPath(previous: Record<string, string>, endId: string): string[] {
    const path = [];
    let step = endId;
    while (step) {
      path.unshift(step);
      step = previous[step];
    }
    return path;
  }
}

/**
 * Example usage of the GraphAlgorithms class.
 */
export const exampleUsage = async (): Promise<void> => {
  const graph: Graph = { nodes: {}, edges: [] };
  const algorithms = new GraphAlgorithms(graph);

  // Add nodes
  algorithms.addNode('A');
  algorithms.addNode('B');
  algorithms.addNode('C');
  algorithms.addNode('D');

  // Add edges
  algorithms.addEdge('A', 'B');
  algorithms.addEdge('B', 'C');
  algorithms.addEdge('A', 'C');
  algorithms.addEdge('C', 'D');

  // Find the shortest path from 'A' to 'D'
  const path = algorithms.dijkstra('A', 'D');
  if (path) {
    console.log(`Shortest path from A to D: ${path.join(' -> ')}`);
  } else {
    console.log('No path found from A to D');
  }
};

// Run the example usage.
exampleUsage();