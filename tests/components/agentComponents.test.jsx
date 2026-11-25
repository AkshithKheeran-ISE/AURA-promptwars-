import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentRosterGrid from '../../src/components/agent/AgentRosterGrid';
import AgentTopology from '../../src/components/agent/AgentTopology';
import ReportTimeline from '../../src/components/reports/ReportTimeline';
import {
  FAMILY_AGENTS_ROSTER,
  SATELLITE_AGENTS_CONFIG
} from '../../src/components/agent/agentConstants';
import { INITIAL_CITIZEN_REPORTS } from '../../src/data/airData';

describe('Agent components', () => {
  it('executes an agent from the roster grid', () => {
    const onExecuteAgent = vi.fn();
    render(<AgentRosterGrid agentMetrics={{}} onExecuteAgent={onExecuteAgent} />);

    const first = FAMILY_AGENTS_ROSTER[0];
    fireEvent.click(screen.getByTitle(first.sampleQuery));
    expect(onExecuteAgent).toHaveBeenCalledWith(first.sampleQuery, first.id);
  });

  it('executes a satellite agent and runs consensus from the topology', () => {
    const onExecuteAgent = vi.fn();
    const onRunConsensus = vi.fn();
    render(
      <AgentTopology
        agentMetrics={{}}
        onRunConsensus={onRunConsensus}
        onExecuteAgent={onExecuteAgent}
      />
    );

    const buttons = screen.getAllByRole('button');
    // First button is the central AURA-CORE consensus node.
    fireEvent.click(buttons[0]);
    expect(onRunConsensus).toHaveBeenCalledTimes(1);

    const firstSatellite = SATELLITE_AGENTS_CONFIG[0];
    const agent = FAMILY_AGENTS_ROSTER[firstSatellite.rosterIndex];
    fireEvent.click(buttons[1]);
    expect(onExecuteAgent).toHaveBeenCalledWith(agent.sampleQuery, firstSatellite.agentId);
  });

  it('advances a report from the timeline', () => {
    const onAdvanceStage = vi.fn();
    render(
      <ReportTimeline
        citizenReports={INITIAL_CITIZEN_REPORTS}
        ledgerTampered={false}
        onAdvanceStage={onAdvanceStage}
      />
    );

    // Seed stages are [4, 3, 2, 1]: three reports have a Next Stage button.
    const buttons = screen.getAllByRole('button', { name: /Next Stage/i });
    expect(buttons).toHaveLength(3);
    // The last button belongs to the stage-1 report (last in seed order).
    fireEvent.click(buttons[2]);
    expect(onAdvanceStage).toHaveBeenCalledWith(INITIAL_CITIZEN_REPORTS[3].id);
  });
});
