import DataLoader from "dataloader";
import { Updoot } from "../../entities/Updoot";

export const createVoteLoader = () =>
  new DataLoader<{ userId: number; postId: number }, number>(async (pairs) => {
    const votes = await Updoot.findByIds(
      pairs as { userId: number; postId: number }[]
    );
    const pairsToVotes: Record<number, Updoot | undefined> = {};
    votes.forEach((v) => {
      pairsToVotes[v.postId] = v;
    });
    return pairs.map((pair) => pairsToVotes[pair.postId]?.value ?? 0);
  });
