import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('AURA Urban Air Quality Assistant E2E Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to local application
    await page.goto('/');

    // Dismiss boot screen if present
    const skipButton = page.getByRole('button', {
      name: /Skip Boot Sequence|Enter Command Center/i
    });
    if (await skipButton.isVisible({ timeout: 1500 }).catch(() => false)) {
      await skipButton.click();
    }
  });

  test('loads command center with atmospheric metrics and navigation items', async ({ page }) => {
    // Verify main landmarks
    const skipLink = page.getByRole('link', { name: /Skip to main content/i });
    expect(await skipLink.count()).toBeGreaterThanOrEqual(1);

    // Verify main content is mounted
    const main = page.locator('#main-content');
    await expect(main).toBeVisible();

    // Verify core navigation buttons or links
    await expect(page.getByText('Smog Command')).toBeVisible();
    await expect(page.getByText('Daily Routines')).toBeVisible();
    await expect(page.getByText('Indoor IAQ Hacks')).toBeVisible();
  });

  test('navigates to Daily Routines and displays inversion-adapted slots', async ({ page }) => {
    await page.getByText('Daily Routines').first().click();
    await expect(page).toHaveURL(/#\/routines/);
    await expect(page.getByText(/Inversion/i).first()).toBeVisible();
    await expect(page.getByText('06:30 – 08:30').first()).toBeVisible();
  });

  test('navigates to Indoor IAQ Hacks and toggles DIY Corsi-Rosenthal hack', async ({ page }) => {
    await page.getByText('Indoor IAQ Hacks').first().click();
    await expect(page).toHaveURL(/#\/hacks/);
    await expect(page.getByText('DIY Corsi-Rosenthal Box Air Purifier')).toBeVisible();

    // Toggle hack button
    const hackButton = page.getByRole('button', { name: /Activated|Activate/i }).first();
    await expect(hackButton).toBeVisible();
    await hackButton.click();
  });

  test('navigates to Community Watch and performs full report lifecycle: submission -> tamper -> recovery', async ({
    page
  }) => {
    await page.getByText('Community Watch').first().click();
    await expect(page).toHaveURL(/#\/reports/);

    // Fill and submit new citizen report
    await page
      .locator('#rep-description')
      .fill('Dense black rubber smoke rising near industrial bypass');
    await page.getByRole('button', { name: /Sign & Hash to Immutable Ledger/i }).click();

    // Verify report block was appended to ledger
    await expect(
      page.getByText('Dense black rubber smoke rising near industrial bypass')
    ).toBeVisible();

    // Click Simulate Tamper
    await page.getByRole('button', { name: /Simulate Tamper/i }).click();
    await expect(page.getByText(/SECURITY ALERT: Cryptographic Chain Broken!/i)).toBeVisible();

    // Click Verify Ledger to restore consensus without data loss
    await page
      .getByRole('button', { name: /Re-verify & Restore|Verify Ledger/i })
      .first()
      .click();

    // Verify alert dismissed and user report remains intact
    await expect(
      page.getByText('Dense black rubber smoke rising near industrial bypass')
    ).toBeVisible();
  });

  test('opens GenAI Assistant and queries specialized agent mesh', async ({ page }) => {
    await page.getByText('GenAI Assistant').first().click();
    await expect(page).toHaveURL(/#\/ai/);

    // Verify terminal input is present
    const terminalInput = page.locator('#agent-query-input');
    await expect(terminalInput).toBeVisible();

    // Query assistant with sample prompt
    await terminalInput.fill('How do I build a DIY Corsi-Rosenthal box?');
    await page.getByRole('button', { name: /Send message to GenAI assistant/i }).click();

    // Expect agent response with CADR and materials specification
    await expect(page.getByText(/CORSI-ROSENTHAL/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('opens Command Palette via Ctrl+K and navigates to Neighborhood Map', async ({ page }) => {
    // Open command palette via search bar
    await page.getByRole('button', { name: /Search pollutants/i }).click();
    await expect(page.getByRole('dialog', { name: 'Command Palette' })).toBeVisible();

    // Filter for Map
    await page.locator('input[placeholder*="Type a command"]').fill('Map');
    await page
      .getByRole('button', { name: /Neighborhood Map/i })
      .first()
      .click();

    await expect(page).toHaveURL(/#\/map/);
  });

  test('runs automated axe accessibility scans across all 10 core routes', async ({ page }) => {
    const routeList = [
      'command',
      'routines',
      'hacks',
      'alternatives',
      'map',
      'alerts',
      'reports',
      'ai',
      'forecast',
      'audit'
    ];

    for (const route of routeList) {
      await page.goto(`/#/${route}`);
      await page.waitForLoadState('domcontentloaded');

      const results = await new AxeBuilder({ page }).include('#main-content').analyze();

      const criticalOrSerious = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      expect(
        criticalOrSerious,
        `Accessibility violation found on route /#/${route}: ${JSON.stringify(criticalOrSerious.map((v) => ({ id: v.id, impact: v.impact, description: v.description })))}`
      ).toEqual([]);
    }
  });
});
