import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentTerminal from '../../src/components/agent/AgentTerminal';

const baseProps = {
  messages: [],
  inputText: '',
  isThinking: false,
  expandedTraceIdx: null,
  onInputChange: vi.fn(),
  onSend: vi.fn(),
  onToggleTrace: vi.fn()
};

const renderTerminal = (props = {}) => render(<AgentTerminal {...baseProps} {...props} />);

describe('AgentTerminal', () => {
  it('renders header, quick prompts and empty chat', () => {
    renderTerminal();
    expect(screen.getByText(/GenAI Smog Assistant Terminal/i)).toBeDefined();
    expect(screen.getByText(/Quick Family Prompts:/i)).toBeDefined();
    expect(screen.getByLabelText(/Ask for custom family routines/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Send message to GenAI assistant/i })).toBeDefined();
  });

  it('renders a user message right-aligned with FAMILY RESIDENT header', () => {
    renderTerminal({
      messages: [{ sender: 'user', text: 'How do I protect my baby?' }]
    });
    expect(screen.getByText(/How do I protect my baby\?/i)).toBeDefined();
    expect(screen.getByText(/FAMILY RESIDENT/i)).toBeDefined();
  });

  it('renders a system message with SYSTEM header and sys styling', () => {
    renderTerminal({
      messages: [{ sender: 'sys', text: 'Ledger verified. All blocks intact.' }]
    });
    expect(screen.getByText(/Ledger verified/i)).toBeDefined();
    expect(screen.getByText(/^SYSTEM$/i)).toBeDefined();
  });

  it('renders an agent message with duration, token and engaged agents', () => {
    renderTerminal({
      messages: [
        {
          sender: 'agent',
          agent: 'PediatricShield',
          text: 'Seal the nursery.',
          durationMs: 142,
          token: 'abcdef1234567890',
          agents: ['PediatricShield', 'IAQEngineer']
        }
      ]
    });
    // Agent name appears in the message header and in the engaged-agents list
    expect(screen.getAllByText(/PediatricShield/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/\(142ms · Token: 0xabcdef12\)/i)).toBeDefined();
    expect(screen.getByText(/Agents Engaged:/i)).toBeDefined();
    expect(screen.getByText(/IAQEngineer/i)).toBeDefined();
  });

  it('renders an agent message without duration or agents when absent', () => {
    renderTerminal({
      messages: [{ sender: 'agent', agent: 'EcoAuditor', text: 'Metro saves ₹3,400/month.' }]
    });
    expect(screen.getByText(/Metro saves/i)).toBeDefined();
    expect(screen.queryByText(/Agents Engaged:/i)).toBeNull();
    expect(screen.queryByText(/Verifiable Execution Trace/i)).toBeNull();
  });

  it('toggles an execution trace open and closed', () => {
    const onToggleTrace = vi.fn();
    const trace = [
      { status: 'COMPLETE', step: 'INPUT_SANITIZATION', detail: 'Sanitized prompt (12 chars)' },
      { status: 'ROUTED', step: 'INTENT_RESOLUTION', detail: 'Routed to PediatricShield' }
    ];
    const { rerender } = renderTerminal({
      messages: [{ sender: 'agent', agent: 'IAQEngineer', text: 'Build the box.', trace }],
      onToggleTrace
    });

    const toggle = screen.getByRole('button', { name: /Verifiable Execution Trace \(2 steps\)/i });
    fireEvent.click(toggle);
    expect(onToggleTrace).toHaveBeenCalledWith(0);

    // Expanded state shows the trace steps
    rerender(
      <AgentTerminal
        {...baseProps}
        onToggleTrace={onToggleTrace}
        expandedTraceIdx={0}
        messages={[{ sender: 'agent', agent: 'IAQEngineer', text: 'Build the box.', trace }]}
      />
    );
    expect(screen.getByText(/INPUT_SANITIZATION/i)).toBeDefined();
    expect(screen.getByText(/Sanitized prompt \(12 chars\)/i)).toBeDefined();
    expect(screen.getByText(/\[COMPLETE\]/i)).toBeDefined();

    // Clicking again collapses
    fireEvent.click(
      screen.getByRole('button', { name: /Verifiable Execution Trace \(2 steps\)/i })
    );
    expect(onToggleTrace).toHaveBeenCalledWith(null);
  });

  it('does not render the trace section for an empty trace', () => {
    renderTerminal({
      messages: [{ sender: 'agent', agent: 'EcoAuditor', text: 'Done.', trace: [] }]
    });
    expect(screen.queryByText(/Verifiable Execution Trace/i)).toBeNull();
  });

  it('shows the thinking indicator while agents calculate', () => {
    renderTerminal({ isThinking: true });
    expect(screen.getByText(/AURA agents calculating inversion profiles/i)).toBeDefined();
  });

  it('sends a quick prompt when clicked', () => {
    const onSend = vi.fn();
    renderTerminal({ onSend });
    const buttons = screen.getAllByRole('button');
    const promptButton = buttons.find((b) => b.textContent.includes('Corsi'));
    expect(promptButton).toBeDefined();
    fireEvent.click(promptButton);
    expect(onSend).toHaveBeenCalledWith(expect.stringContaining('Corsi'));
  });

  it('updates input text and submits the form', async () => {
    const onInputChange = vi.fn();
    const onSend = vi.fn().mockResolvedValue(undefined);
    renderTerminal({ inputText: 'ventilation window?', onInputChange, onSend });

    const input = screen.getByLabelText(/Ask for custom family routines/i);
    expect(input.value).toBe('ventilation window?');
    fireEvent.change(input, { target: { value: 'new question' } });
    expect(onInputChange).toHaveBeenCalledWith('new question');

    fireEvent.click(screen.getByRole('button', { name: /Send message to GenAI assistant/i }));
    expect(onSend).toHaveBeenCalledTimes(1);
  });
});
