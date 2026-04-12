import { fetcher } from "../utilities/fetcher";
import { z } from "zod";

export function trello(config: { apiKey: string; token: string }) {
  const { apiKey, token } = config;
  const query = `?key=${apiKey}&token=${token}`;
  const { request } = fetcher("https://api.trello.com/1");

  const user = request("GET", () => `/members/me${query}`, z.object({}));
  const boards = request(
    "GET",
    () => `/members/me/boards${query}`,
    z.array(z.object({})),
  );
  const board = request(
    "GET",
    ({ boardId }: { boardId: string }) => `/boards/${boardId}${query}`,
    z
      .object({ boardId: z.string() })
      .describe("Retrieve metadata for a specific board"),
  );
  const lists = request(
    "GET",
    ({ boardId }: { boardId: string }) => `/boards/${boardId}/lists${query}`,
    z.object({ boardId: z.string() }).describe("Retrieve all lists on a board"),
  );
  const cards = request(
    "GET",
    ({ boardId }: { boardId: string }) => `/boards/${boardId}/cards${query}`,
    z.object({ boardId: z.string() }).describe("Retrieve all cards on a board"),
  );
  const listCards = request(
    "GET",
    ({ listId }: { listId: string }) => `/lists/${listId}/cards${query}`,
    z
      .object({ listId: z.string() })
      .describe("Retrieve cards in a specific list"),
  );
  const card = request(
    "GET",
    ({ cardId }: { cardId: string }) => `/cards/${cardId}${query}`,
    z.object({ cardId: z.string() }).describe("Retrieve a specific card"),
  );
  const cardComments = request(
    "GET",
    ({ cardId }: { cardId: string }) =>
      `/cards/${cardId}/actions?filter=commentCard${query}`,
    z.object({ cardId: z.string() }).describe("Retrieve comments on a card"),
  );
  const cardAttachments = request(
    "GET",
    ({ cardId }: { cardId: string }) => `/cards/${cardId}/attachments${query}`,
    z.object({ cardId: z.string() }).describe("Retrieve attachments on a card"),
  );
  const cardChecklists = request(
    "GET",
    ({ cardId }: { cardId: string }) => `/cards/${cardId}/checklists${query}`,
    z.object({ cardId: z.string() }).describe("Retrieve checklists for a card"),
  );

  return {
    user,
    boards,
    board,
    lists,
    cards,
    listCards,
    card,
    cardComments,
    cardAttachments,
    cardChecklists,
  };
}
