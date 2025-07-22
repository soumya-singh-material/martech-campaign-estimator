  <script>
    const WEEKLY_FTE_HOURS = 34;

    function generateReport() {
      const smallCount = parseInt(document.getElementById('small').value) || 0;
      const mediumCount = parseInt(document.getElementById('medium').value) || 0;
      const highCount = parseInt(document.getElementById('high').value) || 0;

      const fte = {
        SME: +document.getElementById('smeFTE').value,
        Ops: +document.getElementById('opsFTE').value,
        QA: +document.getElementById('qaFTE').value,
        Arch: +document.getElementById('archFTE').value
      };

      if (smallCount < 0 || mediumCount < 0 || highCount < 0) {
        document.getElementById('report').innerHTML = '<p class="error">Campaign counts cannot be negative.</p>';
        return;
      }

      const effort = {
        Small: { 'Platform SME': 1, 'Campaign Ops': 4, 'QA': 2, 'Architect': 0 },
        Medium: { 'Platform SME': 4, 'Campaign Ops': 8, 'QA': 6, 'Architect': 1 },
        High: { 'Platform SME': 8, 'Campaign Ops': 16, 'QA': 8, 'Architect': 4 }
      };

      const totalHours = {
        'Platform SME': smallCount * effort.Small['Platform SME'] +
                        mediumCount * effort.Medium['Platform SME'] +
                        highCount * effort.High['Platform SME'],
        'Campaign Ops': smallCount * effort.Small['Campaign Ops'] +
                        mediumCount * effort.Medium['Campaign Ops'] +
                        highCount * effort.High['Campaign Ops'],
        'QA': smallCount * effort.Small['QA'] +
              mediumCount * effort.Medium['QA'] +
              highCount * effort.High['QA'],
        'Architect': smallCount * effort.Small['Architect'] +
                     mediumCount * effort.Medium['Architect'] +
                     highCount * effort.High['Architect']
      };
      
      const approximateFTEHours = {
        'Platform SME': totalHours["Platform SME"] / 160,
        'Campaign Ops': totalHours["Campaign Ops"] / 160,
        'QA': totalHours["QA"] / 160,
        'Architect': totalHours["Architect"] / 160
      };

      const totalCampaigns = smallCount + mediumCount + highCount;
      const qaCapacityPerWeek = 4;
      const weeksRequired = Math.max(1, Math.ceil(totalCampaigns / qaCapacityPerWeek));
      const campaignsDelivered = Math.min(totalCampaigns, weeksRequired * qaCapacityPerWeek);

      let report = `
        <div class="section-title"><u>Input Summary</u></div>
        <table>
          <tr><th width="70%">Campaign Type</th><th>Count</th></tr>
          <tr><td>Small</td><td>${smallCount}</td></tr>
          <tr><td>Medium</td><td>${mediumCount}</td></tr>
          <tr><td>High</td><td>${highCount}</td></tr>
          <tr><th>Total Campaigns</th><th>${totalCampaigns}</th></tr>
        </table>

        <div class="section-title">
          <u>Effort Breakdown (Hours)</u>
          <span class="info-icon" onclick="togglePopup()">ℹ️</span>
        </div>
          <table>
            <tr>
              <th width="16%">Role</th>
              <th>Small</th>
              <th>Medium</th>
              <th>Comples</th>
              <th>Total Hours</th>
              <th>Approx. FTE</th>
            </tr>`;
          for (const role in totalHours) {
            report += `<tr>
              <td>${role}</td>
              <td>${smallCount}</td>
              <td>${mediumCount}</td>
              <td>${highCount}</td>
              <td>${totalHours[role]}</td>
              <td>${approximateFTEHours[role].toFixed(2)}</td>
            </tr>`;
          }
          report += `</table>


        <!--<div class="section-title"><u>Delivery Schedule</u></div>
        <table>
          <tr><td width="70%">QA Capacity</td><td>${qaCapacityPerWeek} campaigns/week</td></tr>
          <tr><td>Estimated Weeks Required</td><td>${weeksRequired}</td></tr>
          <tr><td>Campaigns Delivered</td><td>${campaignsDelivered}</td></tr>
        </table>-->

        <div class="section-title">
          Team Spam (Hours)
          <span class="info-icon" onclick="togglePopup()">ℹ️</span>
        </div>

        <table>
          <tr><th>Role</th><th>FTE Count</th><th>Hours per FTE/week</th><th>Total Weekly Hours</th><th>Small Campaign<br/>per week</th><th>Medium Campaign<br/>per week</th><th>High Campaign<br/>per week</th></tr>
          <tr>
            <td>Platform SME</td>
            <td>${fte.SME}</td>
            <td>${WEEKLY_FTE_HOURS}</td>
            <td>${fte.SME * WEEKLY_FTE_HOURS}</td>
            <td>${((fte.SME * WEEKLY_FTE_HOURS) / effort.Small['Platform SME']).toFixed(1)}</td>
            <td>${((fte.SME * WEEKLY_FTE_HOURS) / effort.Medium['Platform SME']).toFixed(1)}</td>
            <td>${((fte.SME * WEEKLY_FTE_HOURS) / effort.High['Platform SME']).toFixed(1)}</td>
          </tr>
          <tr>
            <td>Campaign Ops</td>
            <td>${fte.Ops}</td>
            <td>${WEEKLY_FTE_HOURS}</td>
            <td>${fte.Ops * WEEKLY_FTE_HOURS}</td>
            <td>${((fte.Ops * WEEKLY_FTE_HOURS) / effort.Small['Campaign Ops']).toFixed(1)}</td>
            <td>${((fte.Ops * WEEKLY_FTE_HOURS) / effort.Medium['Campaign Ops']).toFixed(1)}</td>
            <td>${((fte.Ops * WEEKLY_FTE_HOURS) / effort.High['Campaign Ops']).toFixed(1)}</td>
          </tr>
          <tr>
            <td>QA Analyst</td>
            <td>${fte.QA}</td>
            <td>${WEEKLY_FTE_HOURS}</td>
            <td>${fte.QA * WEEKLY_FTE_HOURS}</td>
            <td>${((fte.QA * WEEKLY_FTE_HOURS) / effort.Small['QA']).toFixed(1)}</td>
            <td>${((fte.QA * WEEKLY_FTE_HOURS) / effort.Medium['QA']).toFixed(1)}</td>
            <td>${((fte.QA * WEEKLY_FTE_HOURS) / effort.High['QA']).toFixed(1)}</td>
          </tr>
          <tr>
            <td>Platform Architect</td>
            <td>${fte.Arch}</td>
            <td>${WEEKLY_FTE_HOURS}</td>
            <td>${fte.Arch * WEEKLY_FTE_HOURS}</td>
            <td>${effort.Small['Architect'] > 0 ? ((fte.Arch * WEEKLY_FTE_HOURS) / effort.Small['Architect']).toFixed(1) : 0}</td>
            <td>${effort.Medium['Architect'] > 0 ? ((fte.Arch * WEEKLY_FTE_HOURS) / effort.Medium['Architect']).toFixed(1) : 0}</td>
            <td>${effort.High['Architect'] > 0 ? ((fte.Arch * WEEKLY_FTE_HOURS) / effort.High['Architect']).toFixed(1) : 0}</td>
          </tr>

        </table>


        <div class="section-title"><u>Notes</u></div>
        <ul>
          <li>Each team member is assumed to work 8 hours/day, 40 hours/week.</li>
          <!--<li>QA is the delivery constraint, capped at ${qaCapacityPerWeek} campaigns/week.</li>-->
          <li>Estimation is purely effort-based and does not include buffer time.</li>
        </ul>
      `;

      document.getElementById('report').innerHTML = report;
    }
    
    function togglePopup() {
      const popup = document.getElementById('popup');
      popup.classList.toggle('hidden');
    }

  </script>