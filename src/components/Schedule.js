/* eslint-disable react/prop-types */
import React from 'react';
import {
  Grid, Box, Heading, Link, Text,
} from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import ApplyForWorkshop from './ApplyForWorkshop';

export default function Schedule({ event, timezone, ...props }) {
  const { t } = useTranslation();
  const bg = useColorModeValue('gray.200', 'gray.850');
  const days = (event.schedule || [])
    .map((e) => ({
      ...e,
      start: DateTime.fromISO(e.start).setZone(timezone),
    }))
    .map((e) => ({
      ...e,
      day: e.start.toLocaleString({ weekday: 'long' }),
    }))
    .sort((a, b) => { if (a.start < b.start) return -1; return 1; })
    .reduce((accum, e) => ({ ...accum, [e.day]: [...(accum[e.day] || []), e] }), []);

  if (!event.schedule || event.schedule.length === 0) {
    return (
      <Box {...props}>
        <Heading as="h3" fontSize="3xl" fontWeight="bold">{t('schedule.heading')}</Heading>
        <ApplyForWorkshop event={event} mb={4} />
        <Text mt={8} pb={8} fontSize="2xl" textAlign="center" color="current.textLight">{t('schedule.no-schedule')}</Text>
      </Box>
    );
  }

  return (
    <Box {...props}>
      <Heading as="h3" fontSize="3xl" fontWeight="bold">{t('schedule.heading')}</Heading>
      <ApplyForWorkshop event={event} mb={4} />
      <Grid
        maxWidth={Object.keys(days).length > 1 ? 'container.lg' : 'container.sm'}
        margin="auto"
        templateColumns={{ base: '1fr', md: `repeat(${Object.keys(days).length}, 1fr)` }}
        gap={8}
      >
        {Object.keys(days).map((dayName) => (
          <Box key={dayName}>
            <Heading as="h4" fontSize="xl" mb={4}>{dayName}</Heading>
            {days[dayName].map((e) => (
              <Box key={e.id} mb={4} borderWidth={2}>
                <Box bg={bg} p={1} mb={0} fontSize="sm">
                  {e.link ? (
                    <Link display="inline-block" fontWeight="bold" fontSize="lg" href={e.link} target="_blank">
                      {e.name}
                    </Link>
                  ) : <Text display="inline-block" fontWeight="bold" fontSize="lg" mb={0}>{e.name}</Text>}
                  <Text display="inline-block" ml={4} mb={0}>{e.displayTime}</Text>
                </Box>
                {e.description && (<Text mb={0} p={2} fontSize="sm">{e.description}</Text>)}
              </Box>
            ))}
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
