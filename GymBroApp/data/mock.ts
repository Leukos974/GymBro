import { Conversation, Match, User } from '@/types';

// ── Current User (Lucas) ─────────────────────────────────
export const currentUser: User = {
  id: 1,
  name: 'Lucas',
  photo: require('@/assets/images/lucas.jpg'),
  gym: 'ON AIR FITNESS',
  level: 'Intermédiaire',
  objective: 'Prise de masse',
  availability: 'A partir de 18h la semaine',
  description:
    'Salut ! Je cherche un partenaire pour m\'accompagner dans mon parcours sportif.',
};

// ── Other Users ──────────────────────────────────────────
export const sarah: User = {
  id: 2,
  name: 'Sarah',
  photo: require('@/assets/images/sarah.jpg'),
  gym: 'MY GYM',
  level: 'Débutante',
  objective: 'Prise de masse',
  availability: 'A partir de 17h la semaine',
  description:
    'Je recherche une personne qui pourrait m\'aider à atteindre mes objectifs !',
};

export const lauren: User = {
  id: 3,
  name: 'Lauren',
  photo: require('@/assets/images/lauren.jpg'),
  gym: 'MY GYM',
  level: 'Expert',
  objective: 'Bodybuilding',
  availability: 'A partir de 00h la semaine',
  description:
    'Passionnée de bodybuilding, je cherche quelqu\'un pour s\'entraîner ensemble et se motiver mutuellement !',
};

// ── Matches ──────────────────────────────────────────────
export const matches: Match[] = [
  {
    id: 1,
    user: sarah,
    isTopMatch: true,
  },
  {
    id: 2,
    user: lauren,
    isTopMatch: false,
  },
];

// ── Conversations ────────────────────────────────────────
export const conversations: Conversation[] = [
  {
    id: 1,
    matchUser: sarah,
    messages: [
      {
        id: 1,
        fromUserId: 1,
        toUserId: 2,
        content:
          'Salut, je recherche une partenaire pour m\'accompagnez dans mon parcours sportif.\n\nSerais-tu partante ?',
        timestamp: '2026-02-27T14:30:00',
      },
      {
        id: 2,
        fromUserId: 2,
        toUserId: 1,
        content:
          'OOH Super !!!\n\nJe suis tellement contente d\'avoir touvé un coéquipier !\n\nOn se dit à tout à l\'heure pour une première seance ?',
        timestamp: '2026-02-27T14:35:00',
      },
    ],
  },
  {
    id: 2,
    matchUser: lauren,
    messages: [
      {
        id: 1,
        fromUserId: 3,
        toUserId: 1,
        content:
          'Hey Lucas ! J\'ai vu que tu cherchais un partenaire de muscu. Ça te dit qu\'on s\'entraîne ensemble ?',
        timestamp: '2026-02-27T10:00:00',
      },
      {
        id: 2,
        fromUserId: 1,
        toUserId: 3,
        content:
          'Salut Lauren ! Avec plaisir, tu es dispo quand ?',
        timestamp: '2026-02-27T10:15:00',
      },
      {
        id: 3,
        fromUserId: 3,
        toUserId: 1,
        content:
          'Je suis libre ce soir à partir de 20h, ça te va ?',
        timestamp: '2026-02-27T10:20:00',
      },
    ],
  },
];
